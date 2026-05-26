# Preview Hydration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Far sì che la pagina `/preview/[templateId]` mostri le sezioni che l'utente ha aggiunto/rimosso nell'editor, leggendo da `localStorage` con fallback agli schema defaults. La gallery thumbnails resta neutra grazie a `?clean=true`.

**Architecture:** Server component invariato. Nuovo client component `<PreviewContent>` wrappa `<TemplateRenderer editable={false}>`, gestisce idratazione iniziale da `localStorage`, e ascolta `storage` events per refresh cross-tab. `TemplateThumb` passa `?clean=true` per saltare l'idratazione.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Jest + RTL.

**Spec:** `docs/superpowers/specs/2026-05-26-preview-hydration-design.md`

---

## File Structure

**Nuovi**:
- `app/preview/[templateId]/PreviewContent.tsx` — Client wrapper con idratazione localStorage + storage listener
- `__tests__/app/preview/PreviewContent.test.tsx` — Test idratazione

**Modificati**:
- `app/preview/[templateId]/page.tsx` — Rendea `<PreviewContent>` invece di `<TemplateRenderer>` direttamente
- `components/TemplateThumb.tsx` — Aggiunge `?clean=true` al src dell'iframe

---

## Phase 1 — Client wrapper con idratazione

### Task 1: `<PreviewContent>` componente + test

**Files:**
- Create: `app/preview/[templateId]/PreviewContent.tsx`
- Create: `__tests__/app/preview/PreviewContent.test.tsx`

- [ ] **Step 1: Scrivi il test fallente**

Crea `__tests__/app/preview/PreviewContent.test.tsx`:

```tsx
import { render, screen, act } from '@testing-library/react'
import { PreviewContent } from '@/app/preview/[templateId]/PreviewContent'
import type { TemplateSchema } from '@/lib/schemas/types'

const TEMPLATE_ID = 'preview-test-tpl'

const mockSchema: TemplateSchema = {
  id: TEMPLATE_ID,
  name: 'Preview Test',
  sections: [
    {
      id: 'hero',
      label: 'Hero',
      blockType: 'hero',
      fields: [
        { id: 'headline',    type: 'text',  label: 'H',  default: 'Default headline' },
        { id: 'subheadline', type: 'text',  label: 'S',  default: 'Default sub' },
        { id: 'ctaLabel',    type: 'text',  label: 'C',  default: 'Default CTA' },
        { id: 'bgColor',     type: 'color', label: 'B',  default: '#000000' },
        { id: 'textColor',   type: 'color', label: 'T',  default: '#ffffff' },
        { id: 'accentColor', type: 'color', label: 'A',  default: '#ff0000' },
      ],
    },
  ],
}

const defaults = {
  hero: {
    headline: 'Default headline',
    subheadline: 'Default sub',
    ctaLabel: 'Default CTA',
    bgColor: '#000000',
    textColor: '#ffffff',
    accentColor: '#ff0000',
  },
}

// next/navigation mock
const searchParamsMock = { get: jest.fn() }
jest.mock('next/navigation', () => ({
  useSearchParams: () => searchParamsMock,
}))

describe('PreviewContent', () => {
  beforeEach(() => {
    localStorage.clear()
    searchParamsMock.get.mockReset()
    searchParamsMock.get.mockReturnValue(null)
  })

  it('renders schema defaults when localStorage is empty', () => {
    render(<PreviewContent schema={mockSchema} defaultValues={defaults} />)
    expect(screen.getByText(/Default headline/i)).toBeInTheDocument()
  })

  it('hydrates from localStorage when payload exists', () => {
    const saved = {
      sections: [
        {
          id: 'hero',
          label: 'Hero',
          blockType: 'hero',
          fields: mockSchema.sections[0].fields,
        },
      ],
      sectionOrder: ['hero'],
      values: {
        hero: { ...defaults.hero, headline: 'Saved headline' },
      },
      elementOrder: {},
    }
    localStorage.setItem(`readylayout-${TEMPLATE_ID}`, JSON.stringify(saved))

    render(<PreviewContent schema={mockSchema} defaultValues={defaults} />)
    expect(screen.getByText(/Saved headline/i)).toBeInTheDocument()
  })

  it('ignores localStorage when clean=true', () => {
    const saved = {
      sections: mockSchema.sections,
      sectionOrder: ['hero'],
      values: { hero: { ...defaults.hero, headline: 'Saved headline' } },
      elementOrder: {},
    }
    localStorage.setItem(`readylayout-${TEMPLATE_ID}`, JSON.stringify(saved))
    searchParamsMock.get.mockImplementation((k: string) => (k === 'clean' ? 'true' : null))

    render(<PreviewContent schema={mockSchema} defaultValues={defaults} />)
    expect(screen.getByText(/Default headline/i)).toBeInTheDocument()
    expect(screen.queryByText(/Saved headline/i)).not.toBeInTheDocument()
  })

  it('falls back to defaults on malformed localStorage', () => {
    localStorage.setItem(`readylayout-${TEMPLATE_ID}`, '{not-json')
    render(<PreviewContent schema={mockSchema} defaultValues={defaults} />)
    expect(screen.getByText(/Default headline/i)).toBeInTheDocument()
  })

  it('reacts to storage events from other tabs', () => {
    render(<PreviewContent schema={mockSchema} defaultValues={defaults} />)
    expect(screen.getByText(/Default headline/i)).toBeInTheDocument()

    const updated = {
      sections: mockSchema.sections,
      sectionOrder: ['hero'],
      values: { hero: { ...defaults.hero, headline: 'Cross-tab headline' } },
      elementOrder: {},
    }
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: `readylayout-${TEMPLATE_ID}`,
        newValue: JSON.stringify(updated),
      }))
    })
    expect(screen.getByText(/Cross-tab headline/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — fallisce (modulo non esiste)**

Run: `npm test -- PreviewContent.test.tsx`
Expected: FAIL `Cannot find module '@/app/preview/[templateId]/PreviewContent'`.

- [ ] **Step 3: Implementa `<PreviewContent>`**

Crea `app/preview/[templateId]/PreviewContent.tsx`:

```tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { TemplateRenderer } from '@/components/TemplateRenderer'
import type { Section, TemplateSchema, TemplateValues } from '@/lib/schemas/types'

interface PreviewContentProps {
  schema: TemplateSchema
  defaultValues: TemplateValues
}

interface HydrationState {
  sections: Section[]
  sectionOrder: string[]
  values: TemplateValues
}

function initialState(schema: TemplateSchema, defaults: TemplateValues): HydrationState {
  return {
    sections: schema.sections,
    sectionOrder: schema.sections.map((s) => s.id),
    values: defaults,
  }
}

function parseStorage(raw: string | null): Partial<HydrationState> | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function PreviewContent({ schema, defaultValues }: PreviewContentProps) {
  const searchParams = useSearchParams()
  const clean = searchParams.get('clean') === 'true'
  const [state, setState] = useState<HydrationState>(() => initialState(schema, defaultValues))

  // Initial hydration from localStorage on mount
  useEffect(() => {
    if (clean) return
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(`readylayout-${schema.id}`)
    const parsed = parseStorage(raw)
    if (!parsed) return
    setState({
      sections: Array.isArray(parsed.sections) && parsed.sections.length > 0 ? parsed.sections : schema.sections,
      sectionOrder: Array.isArray(parsed.sectionOrder) && parsed.sectionOrder.length > 0
        ? parsed.sectionOrder
        : schema.sections.map((s) => s.id),
      values: parsed.values && typeof parsed.values === 'object' ? parsed.values : defaultValues,
    })
  }, [clean, schema, defaultValues])

  // Cross-tab updates: listen for storage events
  useEffect(() => {
    if (clean) return
    const key = `readylayout-${schema.id}`
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return
      const parsed = parseStorage(e.newValue)
      if (!parsed) return
      setState({
        sections: Array.isArray(parsed.sections) && parsed.sections.length > 0 ? parsed.sections : schema.sections,
        sectionOrder: Array.isArray(parsed.sectionOrder) && parsed.sectionOrder.length > 0
          ? parsed.sectionOrder
          : schema.sections.map((s) => s.id),
        values: parsed.values && typeof parsed.values === 'object' ? parsed.values : defaultValues,
      })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [clean, schema, defaultValues])

  const orderedSchema = useMemo<TemplateSchema>(() => {
    const ordered = state.sectionOrder
      .map((id) => state.sections.find((s) => s.id === id))
      .filter((s): s is Section => s !== undefined)
    return { ...schema, sections: ordered.length > 0 ? ordered : schema.sections }
  }, [schema, state.sections, state.sectionOrder])

  return <TemplateRenderer schema={orderedSchema} values={state.values} editable={false} />
}
```

- [ ] **Step 4: Run test**

Run: `npm test -- PreviewContent.test.tsx`
Expected: 5 test PASS.

- [ ] **Step 5: Commit**

```bash
git add app/preview/[templateId]/PreviewContent.tsx __tests__/app/preview/PreviewContent.test.tsx
git commit -m "feat(preview): client wrapper hydrates from localStorage"
```

---

### Task 2: Aggiorna `PreviewPage` per usare `<PreviewContent>`

**Files:**
- Modify: `app/preview/[templateId]/page.tsx`

- [ ] **Step 1: Sostituisci il return**

Sostituisci interamente `app/preview/[templateId]/page.tsx` con:

```tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTemplateById } from '@/lib/templates'
import { PreviewContent } from './PreviewContent'
import type { TemplateValues } from '@/lib/schemas/types'

interface PageProps {
  params: Promise<{ templateId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { templateId } = await params
  const schema = getTemplateById(templateId)
  if (!schema) return {}
  return {
    title: `${schema.name} — Anteprima ReadyLayout`,
    description: schema.description,
  }
}

function buildDefaults(schema: ReturnType<typeof getTemplateById>): TemplateValues {
  if (!schema) return {}
  return Object.fromEntries(
    schema.sections.map((section) => [
      section.id,
      Object.fromEntries(section.fields.map((field) => [field.id, field.default])),
    ])
  )
}

export default async function PreviewPage({ params }: PageProps) {
  const { templateId } = await params
  const schema = getTemplateById(templateId)
  if (!schema) notFound()

  const values = buildDefaults(schema)
  return <PreviewContent schema={schema} defaultValues={values} />
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: pass.

- [ ] **Step 3: Verifica route**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/preview/startup-launchpad`
Expected: `200`. (Se non gira dev server, fa partire `npm run dev` prima.)

- [ ] **Step 4: Commit**

```bash
git add app/preview/[templateId]/page.tsx
git commit -m "feat(preview): page renders PreviewContent client wrapper"
```

---

### Task 3: `TemplateThumb` opta per `?clean=true`

**Files:**
- Modify: `components/TemplateThumb.tsx`

- [ ] **Step 1: Aggiorna il src dell'iframe**

In `components/TemplateThumb.tsx`, trova la riga:

```tsx
src={`/preview/${templateId}`}
```

Sostituisci con:

```tsx
src={`/preview/${templateId}?clean=true`}
```

- [ ] **Step 2: Type-check + test full suite**

Run: `npx tsc --noEmit && npm test`
Expected: 0 errori, tutti i test pass.

- [ ] **Step 3: Smoke manuale**

Run: `npm run dev` (se non già attivo).

1. Apri `http://localhost:3000/` (home gallery).
2. I thumbnail mostrano i template **originali**, neutri.
3. Apri `http://localhost:3000/editor/startup-launchpad`.
4. Aggiungi 2 sezioni custom (es. Pricing + FAQ) tramite il `+` o il bottone sidebar.
5. Apri **in una nuova tab** `http://localhost:3000/preview/startup-launchpad`.
6. Verifica: vedi le 2 sezioni custom in coda.
7. Torna alla home: il thumb di startup-launchpad mostra ancora la versione **pulita** (no sezioni custom).
8. Modifica un campo nell'editor (es. headline) → la tab preview dovrebbe aggiornarsi entro un istante grazie allo storage listener.

- [ ] **Step 4: Commit**

```bash
git add components/TemplateThumb.tsx
git commit -m "feat(thumb): gallery thumbnails opt out of preview hydration"
```

---

### Task 4: Smoke E2E + build

**Files:**
- N/A (verifiche)

- [ ] **Step 1: Test suite**

Run: `npm test`
Expected: tutti i test pass (38+ con i nuovi).

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errori.

- [ ] **Step 3: Build production**

Run: `npm run build`
Expected: build successful.

- [ ] **Step 4: Commit marker**

```bash
git commit --allow-empty -m "chore: preview hydration complete"
```

---

## Self-Review

**Coperture spec → task:**

- Spec §"PreviewContent legge localStorage" → Task 1 step 3 ✓
- Spec §"`?clean=true` skip" → Task 1 (logica `clean` const + skip in useEffect) + Task 3 (TemplateThumb passa il param) ✓
- Spec §"storage listener per cross-tab" → Task 1 secondo useEffect ✓
- Spec §"JSON malformato → fallback defaults" → Task 1 step 1 (test) + step 3 (`parseStorage` try/catch) ✓
- Spec §"localStorage undefined (SSR)" → Task 1 step 3 (`typeof window === 'undefined'` guard) ✓
- Spec §"ordering via sectionOrder" → Task 1 step 3 (`orderedSchema` useMemo) ✓
- Spec §"Sections con id non in sectionOrder escluse" → Task 1 step 3 (`.filter(s => s !== undefined)` dopo `.map((id) => find)`) ✓
- Spec §"PreviewPage rendea PreviewContent" → Task 2 ✓
- Spec §"TemplateThumb opt-out" → Task 3 ✓
- Spec §"Testing strategy unit" → Task 1 ha 5 test (vuoto/hydrated/clean/malformato/cross-tab) ✓
- Spec §"Smoke manuale" → Task 3 step 3 ✓

**Placeholder scan:** Nessun TBD/TODO. Ogni step ha codice o comando concreto.

**Type consistency:**
- `HydrationState` definito in Task 1 con `{ sections: Section[], sectionOrder: string[], values: TemplateValues }`. Usato coerentemente.
- `PreviewContentProps` accetta `{ schema: TemplateSchema, defaultValues: TemplateValues }`. Task 2 (PreviewPage) passa proprio quelle prop. Coerente.
- `parseStorage` ritorna `Partial<HydrationState> | null`. Le validazioni runtime (`Array.isArray`, `typeof`) gestiscono i campi opzionali in modo coerente sia nel mount effect che nel storage listener (stessa logica duplicata, accettabile per chiarezza locale).

Nessuna inconsistenza.
