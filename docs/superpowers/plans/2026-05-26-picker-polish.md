# Layout Picker Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Risolvere il bug di clipping del LayoutPicker dentro iframe (lift al parent via Context + postMessage) e sostituire il mini-render con wireframe schematici colorati dall'accent.

**Architecture:** Singola istanza di `<LayoutPicker>` montata nel parent (`<EditorLayout>`). `LayoutPickerContext` espone `openPicker(insertAfterId)`. Sidebar consuma il context. SectionInserter (dentro iframe) usa `postMessage` per parlare col parent — coerente col pattern già esistente (`readylayout-resize`, `readylayout-section-active`). Wireframe sostituisce mini-render in `PresetCard`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Jest + RTL.

**Spec:** `docs/superpowers/specs/2026-05-26-picker-polish-design.md`

---

## File Structure

**Nuovi**:
- `components/editor/picker/LayoutPickerContext.tsx` — Context + provider + `useLayoutPicker()` hook
- `components/editor/picker/WireframePreview.tsx` — Componente wireframe schematico
- `__tests__/components/editor/picker/WireframePreview.test.tsx`

**Modificati**:
- `components/editor/EditorLayout.tsx` — Wrap children in `LayoutPickerProvider`, listener postMessage, single `<LayoutPicker>` instance
- `components/editor/LayoutPicker.tsx` — Sostituisce mini-render con `<WireframePreview>` in `PresetCard`
- `components/editor/SectionInserter.tsx` — Accetta `insertAfterId` (no più `onClick`), postMessage al parent
- `components/TemplateRenderer.tsx` — Rimuove import `LayoutPicker`, passa `insertAfterId` a `SectionInserter`, niente più stato locale picker
- `components/editor/Sidebar.tsx` — Rimuove stato locale + istanza locale di `LayoutPicker`, usa `useLayoutPicker()`

---

## Phase 1 — Context + Listener (foundation per il lift)

### Task 1: `LayoutPickerContext` con provider e hook

**Files:**
- Create: `components/editor/picker/LayoutPickerContext.tsx`

- [ ] **Step 1: Crea il file**

Crea `components/editor/picker/LayoutPickerContext.tsx`:

```tsx
'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface LayoutPickerContextValue {
  open: boolean
  insertAfterId: string | null
  openPicker: (insertAfterId: string | null) => void
  closePicker: () => void
}

const LayoutPickerContext = createContext<LayoutPickerContextValue | null>(null)

export function LayoutPickerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [insertAfterId, setInsertAfterId] = useState<string | null>(null)

  const openPicker = useCallback((afterId: string | null) => {
    setInsertAfterId(afterId)
    setOpen(true)
  }, [])

  const closePicker = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <LayoutPickerContext.Provider value={{ open, insertAfterId, openPicker, closePicker }}>
      {children}
    </LayoutPickerContext.Provider>
  )
}

export function useLayoutPicker(): LayoutPickerContextValue {
  const ctx = useContext(LayoutPickerContext)
  if (!ctx) throw new Error('useLayoutPicker must be used within LayoutPickerProvider')
  return ctx
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/editor/picker/LayoutPickerContext.tsx
git commit -m "feat(picker): add LayoutPickerContext with provider and hook"
```

---

### Task 2: `EditorLayout` wrappa figli + listener postMessage + render `<LayoutPicker>`

**Files:**
- Modify: `components/editor/EditorLayout.tsx`

Note: l'`EditorLayout` è grande. Le modifiche sono mirate: import + wrap del return + un piccolo bridge component nidificato.

- [ ] **Step 1: Aggiungi gli import**

In `components/editor/EditorLayout.tsx`, in cima al file insieme agli altri import:

```tsx
import { LayoutPickerProvider, useLayoutPicker } from './picker/LayoutPickerContext'
import { LayoutPicker } from './LayoutPicker'
```

- [ ] **Step 2: Crea un componente `PickerBridge` nello stesso file**

In fondo al file (dopo la chiusura di `EditorLayout`), aggiungi:

```tsx
function PickerBridge() {
  const { open, insertAfterId, openPicker, closePicker } = useLayoutPicker()

  // Listen for postMessage from iframe canvas (SectionInserter)
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type !== 'readylayout-open-picker') return
      const id = e.data.insertAfterId
      const valid = id === null || typeof id === 'string'
      if (!valid) return
      openPicker(id)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [openPicker])

  return <LayoutPicker open={open} insertAfterId={insertAfterId} onClose={closePicker} />
}
```

- [ ] **Step 3: Wrappa il return di `EditorLayout` con `LayoutPickerProvider` + monta `PickerBridge`**

Trova il `return ( ... )` di `EditorLayout` e wrap il root con `LayoutPickerProvider`. All'interno del provider, dopo il main layout, monta `<PickerBridge />`. Esempio struttura:

```tsx
return (
  <LayoutPickerProvider>
    {/* ...existing JSX root... */}
    <PickerBridge />
  </LayoutPickerProvider>
)
```

L'esatta posizione di `<PickerBridge />` dipende dalla struttura: deve stare DENTRO il provider e DOPO il contenuto principale (così il modal compare sopra). Se il root JSX è già un fragment o un div, mettilo subito prima di `</LayoutPickerProvider>`.

- [ ] **Step 4: Verifica useEffect import**

`useEffect` deve essere già importato (è usato altrove in `EditorLayout.tsx`). Se non lo è, aggiungi `useEffect` all'import da `react` in cima al file. Verifica con:

Run: `grep -n "useEffect" components/editor/EditorLayout.tsx | head -3`
Expected: almeno una riga import e usi nel file. Se l'import manca, aggiungilo.

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add components/editor/EditorLayout.tsx
git commit -m "feat(editor): mount single LayoutPicker in EditorLayout via context+bridge"
```

---

## Phase 2 — Sidebar e SectionInserter usano il nuovo bridge

### Task 3: Sidebar consuma `useLayoutPicker()` invece di stato locale

**Files:**
- Modify: `components/editor/Sidebar.tsx`

- [ ] **Step 1: Aggiungi import**

In cima a `components/editor/Sidebar.tsx`:

```tsx
import { useLayoutPicker } from './picker/LayoutPickerContext'
```

E rimuovi l'import esistente di `LayoutPicker`:

```tsx
// RIMUOVI questa riga:
import { LayoutPicker } from './LayoutPicker'
```

- [ ] **Step 2: Rimuovi stato locale picker e usa il context**

Trova il blocco:

```tsx
const [pickerOpen, setPickerOpen] = useState(false)
```

e sostituiscilo con:

```tsx
const { openPicker } = useLayoutPicker()
```

- [ ] **Step 3: Aggiorna il bottone "Aggiungi sezione" per chiamare `openPicker`**

Trova il bottone con `onClick={() => setPickerOpen(true)}` e modifica:

```tsx
onClick={() => openPicker(orderedSections.length > 0 ? orderedSections[orderedSections.length - 1].id : null)}
```

- [ ] **Step 4: Rimuovi `<LayoutPicker>` dal JSX del Sidebar**

Trova e rimuovi:

```tsx
<LayoutPicker
  open={pickerOpen}
  insertAfterId={orderedSections.length > 0 ? orderedSections[orderedSections.length - 1].id : null}
  onClose={() => setPickerOpen(false)}
/>
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add components/editor/Sidebar.tsx
git commit -m "refactor(sidebar): use LayoutPickerContext instead of local picker state"
```

---

### Task 4: `SectionInserter` accetta `insertAfterId` e postMessage al parent

**Files:**
- Modify: `components/editor/SectionInserter.tsx`

- [ ] **Step 1: Sostituisci il componente**

Sostituisci interamente `components/editor/SectionInserter.tsx`:

```tsx
'use client'

import { useState } from 'react'

interface SectionInserterProps {
  insertAfterId: string | null
}

export function SectionInserter({ insertAfterId }: SectionInserterProps) {
  const [hover, setHover] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Inside iframe canvas: post to parent. If somehow rendered in parent
    // (no parent != self), this still posts to itself and is harmless.
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'readylayout-open-picker', insertAfterId }, '*')
    } else if (typeof window !== 'undefined') {
      window.postMessage({ type: 'readylayout-open-picker', insertAfterId }, '*')
    }
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        height: hover ? 40 : 8,
        transition: 'height var(--dur-hover) var(--ease-out)',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: '50%',
          height: 1,
          background: 'var(--ed-accent)',
          opacity: hover ? 1 : 0,
          transition: 'opacity var(--dur-hover) var(--ease-out)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '4px 14px',
          borderRadius: 999,
          background: 'var(--ed-accent)',
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          opacity: hover ? 1 : 0,
          transition: 'opacity var(--dur-hover) var(--ease-out)',
          pointerEvents: 'none',
          boxShadow: '0 2px 6px -1px rgb(0 0 0 / 0.2)',
        }}
      >
        + Aggiungi sezione
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: pass (TemplateRenderer ancora usa il vecchio API, fallirà al prossimo task — lo sistemiamo subito sotto).

Se tsc lamenta `Property 'onClick' does not exist` per TemplateRenderer (che ancora usa `<SectionInserter onClick={...} />`), procedi: lo fixiamo nel prossimo task. Se invece tsc è pulito, ok lo stesso.

- [ ] **Step 3: Commit**

```bash
git add components/editor/SectionInserter.tsx
git commit -m "refactor(inserter): post to parent window instead of local onClick"
```

---

### Task 5: `TemplateRenderer` rimuove picker locale e usa il nuovo API SectionInserter

**Files:**
- Modify: `components/TemplateRenderer.tsx`

- [ ] **Step 1: Rimuovi gli import non più usati**

In cima a `components/TemplateRenderer.tsx`, rimuovi:

```tsx
import { LayoutPicker } from './editor/LayoutPicker'
```

`SectionInserter` rimane.

- [ ] **Step 2: Sostituisci `EditableTemplate`**

Sostituisci interamente la funzione `EditableTemplate` con:

```tsx
function EditableTemplate({ schema, values }: { schema: TemplateSchema; values: TemplateValues }) {
  const storeSections = useEditorStore((s) => s.sections)
  const sectionOrder = useEditorStore((s) => s.sectionOrder)

  const orderedSections: Section[] = sectionOrder
    .map((id) => storeSections.find((s) => s.id === id))
    .filter((s): s is Section => s !== undefined)

  return (
    <div className="font-sans" data-template={schema.id}>
      {/* Inserter all'inizio (sopra la prima sezione) */}
      <SectionInserter insertAfterId="" />
      {orderedSections.map((section, index) => {
        const prevId = index === 0 ? null : orderedSections[index - 1].id
        return (
          <div key={section.id}>
            {index > 0 && <SectionInserter insertAfterId={prevId} />}
            <DraggableSection section={section} values={values[section.id] ?? {}} index={index} />
          </div>
        )
      })}
      {/* Inserter in coda */}
      {orderedSections.length > 0 && (
        <SectionInserter insertAfterId={orderedSections[orderedSections.length - 1].id} />
      )}
    </div>
  )
}
```

Note: rimosso lo stato locale `pickerOpen` / `insertAfterId` / `openPicker` e il `<LayoutPicker>` finale. `useState` può ancora servire altrove nel file (per `DraggableSection`) — non rimuovere l'import.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add components/TemplateRenderer.tsx
git commit -m "refactor(canvas): template renderer no longer owns picker"
```

---

## Phase 3 — Wireframe preview

### Task 6: `WireframePreview` componente + test

**Files:**
- Create: `components/editor/picker/WireframePreview.tsx`
- Create: `__tests__/components/editor/picker/WireframePreview.test.tsx`

- [ ] **Step 1: Scrivi il test fallente**

Crea `__tests__/components/editor/picker/WireframePreview.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { WireframePreview } from '@/components/editor/picker/WireframePreview'
import type { BlockType } from '@/lib/schemas/types'

const ALL_BLOCK_TYPES: BlockType[] = [
  'hero', 'features', 'pricing', 'faq', 'cta', 'about', 'gallery', 'articles',
  'contact', 'linklist', 'menu', 'products', 'testimonials', 'stats', 'schedule', 'textblock',
]

describe('WireframePreview', () => {
  it('renders a wireframe for every known blockType without crashing', () => {
    for (const bt of ALL_BLOCK_TYPES) {
      const { container, unmount } = render(<WireframePreview blockType={bt} />)
      expect(container.querySelector('[data-wireframe]')).not.toBeNull()
      expect(container.querySelector(`[data-wireframe="${bt}"]`)).not.toBeNull()
      unmount()
    }
  })

  it('applies accentColor to the accent element', () => {
    const { container } = render(<WireframePreview blockType="hero" accentColor="rgb(255, 0, 0)" />)
    const accent = container.querySelector('[data-wireframe-accent]') as HTMLElement | null
    expect(accent).not.toBeNull()
    expect(accent!.style.background).toContain('255')
  })

  it('falls back to a generic wireframe for unknown blockType', () => {
    // @ts-expect-error — testing the runtime fallback
    const { container } = render(<WireframePreview blockType="unknown-block" />)
    expect(container.querySelector('[data-wireframe="fallback"]')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run test — deve fallire (modulo non esiste)**

Run: `npm test -- WireframePreview.test.tsx`
Expected: FAIL `Cannot find module '@/components/editor/picker/WireframePreview'`.

- [ ] **Step 3: Implementa `WireframePreview`**

Crea `components/editor/picker/WireframePreview.tsx`:

```tsx
'use client'

import type { BlockType } from '@/lib/schemas/types'

interface WireframePreviewProps {
  blockType: BlockType
  accentColor?: string
  bgColor?: string
  textColor?: string
}

const DEFAULT_BG = '#ffffff'
const DEFAULT_TEXT = '#0f172a'
const DEFAULT_ACCENT = '#3b82f6'

export function WireframePreview({ blockType, accentColor, bgColor, textColor }: WireframePreviewProps) {
  const bg = bgColor ?? DEFAULT_BG
  const text = textColor ?? DEFAULT_TEXT
  const accent = accentColor ?? DEFAULT_ACCENT
  const c = { bg, text, accent }

  return (
    <div
      data-wireframe={KNOWN.has(blockType) ? blockType : 'fallback'}
      style={{
        width: '100%',
        height: '100%',
        background: bg,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {render(blockType, c)}
    </div>
  )
}

type Colors = { bg: string; text: string; accent: string }

const KNOWN = new Set<BlockType>([
  'hero','features','pricing','faq','cta','about','gallery','articles',
  'contact','linklist','menu','products','testimonials','stats','schedule','textblock',
])

function render(blockType: BlockType, c: Colors) {
  switch (blockType) {
    case 'hero':        return Hero(c)
    case 'features':    return Features(c)
    case 'pricing':     return Pricing(c)
    case 'faq':         return Faq(c)
    case 'cta':         return Cta(c)
    case 'about':       return About(c)
    case 'gallery':     return Gallery(c)
    case 'articles':    return Articles(c)
    case 'contact':     return Contact(c)
    case 'linklist':    return LinkList(c)
    case 'menu':        return Menu(c)
    case 'products':    return Products(c)
    case 'testimonials':return Testimonials(c)
    case 'stats':       return Stats(c)
    case 'schedule':    return Schedule(c)
    case 'textblock':   return TextBlock(c)
    default:            return Fallback(c)
  }
}

const bar = (c: Colors, w: string, h = 6) => (
  <div style={{ width: w, height: h, background: c.text, opacity: 0.85, borderRadius: 2 }} />
)
const barMuted = (c: Colors, w: string, h = 4) => (
  <div style={{ width: w, height: h, background: c.text, opacity: 0.35, borderRadius: 2 }} />
)
const pill = (c: Colors, w = 60, h = 16) => (
  <div data-wireframe-accent style={{ width: w, height: h, background: c.accent, borderRadius: 999 }} />
)
const rect = (c: Colors, opacity = 0.15) => (
  <div style={{ flex: 1, background: c.text, opacity, borderRadius: 4 }} />
)

function Hero(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
      {bar(c, '70%', 10)}
      {bar(c, '55%', 10)}
      <div style={{ height: 6 }} />
      {barMuted(c, '60%')}
      {barMuted(c, '45%')}
      <div style={{ height: 8 }} />
      {pill(c, 80, 18)}
    </div>
  )
}

function Features(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>{bar(c, '40%', 8)}</div>
      <div style={{ display: 'flex', gap: 10, flex: 1, marginTop: 4 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', justifyContent: 'flex-start', padding: 6 }}>
            <div data-wireframe-accent style={{ width: 14, height: 14, borderRadius: 999, background: c.accent }} />
            {bar(c, '70%', 5)}
            {barMuted(c, '90%', 3)}
            {barMuted(c, '60%', 3)}
          </div>
        ))}
      </div>
    </div>
  )
}

function About(c: Colors) {
  return (
    <div style={{ flex: 1, display: 'flex', gap: 12, padding: 16 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
        {barMuted(c, '40%', 4)}
        {bar(c, '85%', 8)}
        {bar(c, '60%', 8)}
        <div style={{ height: 4 }} />
        {barMuted(c, '95%', 3)}
        {barMuted(c, '85%', 3)}
        {barMuted(c, '70%', 3)}
      </div>
      <div style={{ flex: 1, display: 'flex' }}>{rect(c, 0.2)}</div>
    </div>
  )
}

function Cta(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        background: c.accent, opacity: 0.12, borderRadius: 8, padding: 16,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '80%',
      }}>
        {bar(c, '60%', 8)}
        {barMuted(c, '70%', 4)}
        <div style={{ height: 4 }} />
        {pill(c, 70, 16)}
      </div>
    </div>
  )
}

function Faq(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>{bar(c, '40%', 8)}</div>
      {[0,1,2].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', border: `1px solid ${c.text}22`, borderRadius: 4 }}>
          {bar(c, '60%', 5)}
          <span style={{ color: c.text, opacity: 0.5, fontSize: 10 }}>›</span>
        </div>
      ))}
    </div>
  )
}

function Pricing(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>{bar(c, '40%', 8)}</div>
      <div style={{ display: 'flex', gap: 6, flex: 1 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            flex: 1, border: `1px solid ${i === 1 ? c.accent : c.text + '22'}`,
            borderWidth: i === 1 ? 2 : 1, borderRadius: 6, padding: 8,
            display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center',
          }}>
            {bar(c, '50%', 4)}
            {bar(c, '70%', 10)}
            {barMuted(c, '60%', 3)}
            {barMuted(c, '50%', 3)}
          </div>
        ))}
      </div>
    </div>
  )
}

function Testimonials(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>{bar(c, '40%', 8)}</div>
      <div style={{ display: 'flex', gap: 10, flex: 1 }}>
        {[0,1].map(i => (
          <div key={i} style={{
            flex: 1, border: `1px solid ${c.text}22`, borderRadius: 6, padding: 8,
            display: 'flex', flexDirection: 'column', gap: 4, position: 'relative',
          }}>
            <span style={{ position: 'absolute', top: 2, left: 6, color: c.accent, fontSize: 16, lineHeight: 1 }}>&ldquo;</span>
            <div style={{ height: 10 }} />
            {barMuted(c, '90%', 3)}
            {barMuted(c, '70%', 3)}
            <div style={{ height: 4 }} />
            {bar(c, '40%', 4)}
          </div>
        ))}
      </div>
    </div>
  )
}

function Stats(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 16, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div data-wireframe-accent style={{ width: 40, height: 14, background: c.accent, borderRadius: 2 }} />
          {barMuted(c, '50px', 3)}
        </div>
      ))}
    </div>
  )
}

function Gallery(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 10, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 6 }}>
      {[0,1,2,3,4,5].map(i => <div key={i} style={{ background: c.text, opacity: 0.15, borderRadius: 4 }} />)}
    </div>
  )
}

function Menu(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {bar(c, '40%', 8)}
      {[0,1,2,3].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {bar(c, '40%', 4)}
          <div style={{ flex: 1, borderBottom: `1px dashed ${c.text}33`, marginTop: -2 }} />
          {bar(c, '12%', 4)}
        </div>
      ))}
    </div>
  )
}

function Products(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 10, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ flex: 1, background: c.text, opacity: 0.15, borderRadius: 4 }} />
          {bar(c, '70%', 4)}
          <div data-wireframe-accent style={{ width: 30, height: 6, background: c.accent, borderRadius: 2 }} />
        </div>
      ))}
    </div>
  )
}

function Schedule(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 5 }}>
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: 999, background: c.accent }} />
          {bar(c, '25%', 4)}
          {barMuted(c, '50%', 3)}
        </div>
      ))}
    </div>
  )
}

function LinkList(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: 999, background: c.text, opacity: 0.2 }} />
      {bar(c, '40%', 5)}
      {[0,1,2,3].map(i => (
        <div key={i} style={{ width: '70%', height: 12, borderRadius: 999, border: `1px solid ${c.text}33` }} />
      ))}
    </div>
  )
}

function Articles(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ width: 32, height: 24, background: c.text, opacity: 0.15, borderRadius: 3 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {bar(c, '70%', 4)}
            {barMuted(c, '90%', 3)}
          </div>
        </div>
      ))}
    </div>
  )
}

function TextBlock(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
      {barMuted(c, '85%', 3)}
      {barMuted(c, '90%', 3)}
      {barMuted(c, '75%', 3)}
      {barMuted(c, '88%', 3)}
      {barMuted(c, '60%', 3)}
    </div>
  )
}

function Contact(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width: '100%', height: 14, border: `1px solid ${c.text}33`, borderRadius: 3 }} />
      ))}
      <div data-wireframe-accent style={{ alignSelf: 'flex-start', width: 70, height: 16, background: c.accent, borderRadius: 999, marginTop: 4 }} />
    </div>
  )
}

function Fallback(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div data-wireframe-accent style={{
        padding: '8px 14px', border: `2px dashed ${c.accent}`, borderRadius: 6, color: c.text, fontSize: 10, opacity: 0.6,
      }}>
        block
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm test -- WireframePreview.test.tsx`
Expected: 3 test PASS.

- [ ] **Step 5: Commit**

```bash
git add components/editor/picker/WireframePreview.tsx __tests__/components/editor/picker/WireframePreview.test.tsx
git commit -m "feat(picker): add WireframePreview component with 16 layouts + fallback"
```

---

### Task 7: `LayoutPicker` usa `WireframePreview` invece di mini-render

**Files:**
- Modify: `components/editor/LayoutPicker.tsx`

- [ ] **Step 1: Aggiungi import**

In cima a `components/editor/LayoutPicker.tsx`, sostituisci:

```tsx
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
```

con:

```tsx
import { WireframePreview } from './picker/WireframePreview'
```

- [ ] **Step 2: Sostituisci il mini-render in `PresetCard`**

In `PresetCard`, sostituisci tutto il blocco "Mini-render":

```tsx
{/* Mini-render */}
<div style={{
  width: '100%',
  aspectRatio: '3 / 2',
  overflow: 'hidden',
  position: 'relative',
  background: '#fff',
  pointerEvents: 'none',
}}>
  <div style={{
    width: 1280,
    transform: 'scale(0.1875)',
    transformOrigin: 'top left',
  }}>
    <BlockRenderer
      blockType={preset.blockType}
      sectionId={preset.id}
      values={preset.defaultValues}
      variant={preset.variant}
    />
  </div>
</div>
```

con:

```tsx
{/* Wireframe preview */}
<div style={{
  width: '100%',
  aspectRatio: '3 / 2',
  overflow: 'hidden',
  position: 'relative',
  pointerEvents: 'none',
}}>
  <WireframePreview
    blockType={preset.blockType}
    accentColor={preset.defaultValues.accentColor as string | undefined}
    bgColor={preset.defaultValues.bgColor as string | undefined}
    textColor={preset.defaultValues.textColor as string | undefined}
  />
</div>
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: pass.

- [ ] **Step 4: Run full test suite**

Run: `npm test`
Expected: tutti PASS.

- [ ] **Step 5: Commit**

```bash
git add components/editor/LayoutPicker.tsx
git commit -m "feat(picker): use WireframePreview instead of scaled mini-render"
```

---

## Phase 4 — Verifica end-to-end

### Task 8: Smoke test E2E

**Files:**
- N/A (verifiche manuali)

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: tutti PASS (33+ test totali).

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errori.

- [ ] **Step 3: Build production**

Run: `npm run build`
Expected: build successful.

- [ ] **Step 4: Smoke test manuale**

Run: `npm run dev` (se non già attivo).
Apri `http://localhost:3000/editor/startup-launchpad`.

Verifica:
1. Scroll fino in fondo al canvas (sotto l'ultima sezione).
2. Hover tra le sezioni in fondo → vedi `+ Aggiungi sezione`.
3. Click → **modal compare al centro della viewport del parent**, non al centro dell'iframe (test del fix principale).
4. Apri devtools console: dovresti vedere nessun errore relativo a postMessage.
5. Le 8 card mostrano wireframe **distinguibili**: Hero (titolo + CTA), Features (3 colonne), About (split), CTA (centrato), FAQ (3 righe), Pricing (3 tier centrale evidenziato), Testimonials (2 card), Stats (3 numeroni).
6. L'accent color del preset è visibile nella preview (es. hero blu, pricing tier centrale blu).
7. Click "Hero · classico" → nuova sezione hero aggiunta in fondo → modal chiude.
8. Apri picker dal sidebar (bottone "+ Aggiungi sezione" in fondo lista) → stesso modal, posizionato correttamente.
9. Test undo (Cmd/Ctrl+Z se mappato) → la sezione aggiunta sparisce.

- [ ] **Step 5: Commit empty marker se tutto ok**

```bash
git commit --allow-empty -m "chore: picker polish complete (lift to parent + wireframes)"
```

---

## Self-Review

**Coperture spec → task:**

- Spec §"Picker lift — dal canvas al parent" → Task 1 (context), Task 2 (EditorLayout host + listener), Task 3 (Sidebar consume), Task 4 (SectionInserter postMessage), Task 5 (TemplateRenderer cleanup) ✓
- Spec §"Wireframe preview" → Task 6 (componente + test), Task 7 (LayoutPicker usa wireframe) ✓
- Spec §"postMessage origin '*'" → Task 4 usa `'*'` ✓
- Spec §"Listener cleanup" → Task 2 step 2 ha cleanup useEffect ✓
- Spec §"insertAfterId validation" → Task 2 step 2 valida `null | string` ✓
- Spec §"Re-entry" → Task 1 `openPicker` aggiorna stato senza chiudere ✓
- Spec §"Default colors fallback" → Task 6 ha `DEFAULT_BG/TEXT/ACCENT` ✓
- Spec §"Wireframe per blockType (16 blocchi)" → Task 6 implementa tutti i 16 + fallback ✓
- Spec §"Testing strategy" → Task 6 test per ogni blockType + accentColor + fallback ✓

**Placeholder scan:** nessun TBD/TODO/"implement later". Ogni step ha codice o comando concreto.

**Type consistency:**
- `LayoutPickerContextValue` definito in Task 1 con `openPicker(insertAfterId: string | null)`. Task 3 (Sidebar) chiama `openPicker(...)` con argomento `string | null`. Coerente.
- `SectionInserter` accetta `insertAfterId: string | null` in Task 4. Task 5 lo invoca con `""`, `prevId`, e `last id`. Coerenti col tipo (string '' o id valido).
- Message shape `{ type: 'readylayout-open-picker', insertAfterId }`. Task 2 valida `id === null || typeof id === 'string'` — coerente col tipo emesso.
- `WireframePreview` accetta `accentColor?`, `bgColor?`, `textColor?` opzionali (Task 6). Task 7 li passa col cast `as string | undefined`. Coerente.

Nessuna inconsistenza trovata.
