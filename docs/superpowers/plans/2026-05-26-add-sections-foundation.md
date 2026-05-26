# Add/Remove Sections — Foundation + Picker (Plan 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permettere all'utente di aggiungere/rimuovere sezioni runtime tramite picker modale (8 preset iniziali, no variants), con persistenza, undo/redo e regola "prima sezione non rimovibile". Le sezioni diventano fonte di verità mutabile nello store.

**Architecture:** Lo store di editor (Zustand) assume controllo delle `sections`, inizializzandole da `schema.sections` ma poi mutandole liberamente. Le azioni `addSection`/`removeSection` clonano da `LAYOUT_PRESETS` (`lib/presets/layouts.ts`). UI: `<SectionInserter>` inline nel canvas + bottone nel sidebar aprono `<LayoutPickerModal>`. Il prop `variant` viene aggiunto al type `Section` ora (retrocompatibile, optional) ma non implementato sui block — quello è Plan 2.

**Tech Stack:** Next.js 16 App Router, React 19, Zustand 5, TypeScript, Jest + RTL.

**Spec:** `docs/superpowers/specs/2026-05-26-add-sections-design.md`

**Scope di questo piano (Plan 1):**
- Refactor store con `sections` mutabile
- Azioni `addSection` / `removeSection` / `duplicateSection`
- Picker UI funzionante con 8 preset (Hero, Features, About, CTA, FAQ, Pricing, Testimonials, Stats — uno per blockType, senza variants)
- `<SectionInserter>` inline nel canvas
- Sidebar: bottone aggiungi + `×` rimuovi

**Fuori scope (Plan 2 follow-up):**
- Variant prop sui block components
- Preset rimanenti (target 35 totali)
- UI per cambiare variant a sezione esistente
- Template "blank" da zero

---

## File Structure

**Nuovi**:
- `lib/presets/layouts.ts` — registry preset + tipo `LayoutPreset`
- `lib/utils/uniqueId.ts` — helper generazione ID univoci
- `components/editor/SectionInserter.tsx` — drop zone inline `+`
- `components/editor/LayoutPicker.tsx` — modal con griglia preset
- `__tests__/lib/presets/layouts.test.ts`
- `__tests__/lib/utils/uniqueId.test.ts`
- `__tests__/lib/store/sections.test.ts`

**Modificati**:
- `lib/schemas/types.ts` — aggiunge `variant?: string` a `Section`
- `lib/store/editor.store.ts` — `sections` mutabile, snapshots, azioni
- `lib/store/editor-context.tsx` — storage handler sincronizza anche `sections`
- `components/TemplateRenderer.tsx` — legge `sections` dallo store + inserisce `SectionInserter`
- `components/editor/Sidebar.tsx` — legge `sections` dallo store + bottone aggiungi + `×` rimuovi
- `app/canvas/[templateId]/CanvasContent.tsx` — `StorageSyncer` sincronizza anche `sections`
- `components/blocks/BlockRenderer.tsx` — accetta+passa `variant` (no-op per ora)

---

## Phase 1 — Foundation (data layer)

### Task 1: Aggiungere `variant?` al type Section

**Files:**
- Modify: `lib/schemas/types.ts:67-72`
- Test: `__tests__/lib/schemas/types.test.ts`

- [ ] **Step 1: Leggi il test esistente per types**

Run: `cat __tests__/lib/schemas/types.test.ts`

Familiarizza con la struttura. Identifica quale schema viene importato per la verifica di tipo.

- [ ] **Step 2: Aggiungi un test che verifica che `variant` è optional**

Modifica `__tests__/lib/schemas/types.test.ts` aggiungendo in fondo:

```ts
import type { Section } from '@/lib/schemas/types'

describe('Section type', () => {
  it('accetta variant opzionale', () => {
    const withVariant: Section = {
      id: 's1',
      label: 'L',
      blockType: 'hero',
      variant: 'centered',
      fields: [],
    }
    const withoutVariant: Section = {
      id: 's2',
      label: 'L',
      blockType: 'hero',
      fields: [],
    }
    expect(withVariant.variant).toBe('centered')
    expect(withoutVariant.variant).toBeUndefined()
  })
})
```

- [ ] **Step 3: Run test — deve fallire al type-check (variant non esiste)**

Run: `npx tsc --noEmit`
Expected: error `'variant' does not exist in type 'Section'`.

- [ ] **Step 4: Aggiungi `variant?: string` al Section**

In `lib/schemas/types.ts`, sostituisci:

```ts
export interface Section {
  id: string
  label: string
  blockType: BlockType
  fields: Field[]
}
```

con:

```ts
export interface Section {
  id: string
  label: string
  blockType: BlockType
  variant?: string
  fields: Field[]
}
```

- [ ] **Step 5: Run tests + type-check**

Run: `npx tsc --noEmit && npm test -- types.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/schemas/types.ts __tests__/lib/schemas/types.test.ts
git commit -m "feat(types): add optional variant to Section"
```

---

### Task 2: Helper uniqueId

**Files:**
- Create: `lib/utils/uniqueId.ts`
- Test: `__tests__/lib/utils/uniqueId.test.ts`

- [ ] **Step 1: Scrivi il test fallente**

Crea `__tests__/lib/utils/uniqueId.test.ts`:

```ts
import { uniqueSectionId } from '@/lib/utils/uniqueId'

describe('uniqueSectionId', () => {
  it('genera id con prefisso blockType e suffisso', () => {
    const id = uniqueSectionId('hero')
    expect(id).toMatch(/^hero-[a-z0-9]{6}$/)
  })

  it('produce id diversi su chiamate successive', () => {
    const a = uniqueSectionId('features')
    const b = uniqueSectionId('features')
    expect(a).not.toBe(b)
  })

  it('evita collisione con un set di id già usati', () => {
    const used = new Set(['hero-aaaaaa', 'hero-bbbbbb'])
    const id = uniqueSectionId('hero', used)
    expect(used.has(id)).toBe(false)
  })
})
```

- [ ] **Step 2: Run — deve fallire perché il modulo non esiste**

Run: `npm test -- uniqueId.test.ts`
Expected: FAIL `Cannot find module '@/lib/utils/uniqueId'`.

- [ ] **Step 3: Implementa il modulo**

Crea `lib/utils/uniqueId.ts`:

```ts
import type { BlockType } from '@/lib/schemas/types'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'

function randomSuffix(length = 6): string {
  let s = ''
  const arr = new Uint32Array(length)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(arr)
    for (let i = 0; i < length; i++) s += ALPHABET[arr[i] % ALPHABET.length]
  } else {
    for (let i = 0; i < length; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return s
}

export function uniqueSectionId(blockType: BlockType, taken?: ReadonlySet<string>): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = `${blockType}-${randomSuffix(6)}`
    if (!taken || !taken.has(candidate)) return candidate
  }
  // Fallback: aumenta entropia
  return `${blockType}-${randomSuffix(10)}`
}
```

- [ ] **Step 4: Run test**

Run: `npm test -- uniqueId.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/utils/uniqueId.ts __tests__/lib/utils/uniqueId.test.ts
git commit -m "feat(utils): add uniqueSectionId helper"
```

---

### Task 3: Refactor store — `sections` mutabile + migrazione

**Files:**
- Modify: `lib/store/editor.store.ts` (intero refactor di stato + persistenza)
- Test: `__tests__/lib/store/editor.store.test.ts` (test esistenti devono ancora passare)
- Test: `__tests__/lib/store/sections.test.ts` (nuovo)

- [ ] **Step 1: Test fallente per `sections` nello state**

Crea `__tests__/lib/store/sections.test.ts`:

```ts
import { createEditorStore } from '@/lib/store/editor.store'
import { startupLaunchpadSchema } from '@/lib/schemas/startup-launchpad'

describe('store: sections mutabili', () => {
  it('inizializza sections come deep clone di schema.sections', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const state = store.getState()
    expect(state.sections).toHaveLength(startupLaunchpadSchema.sections.length)
    expect(state.sections[0].id).toBe(startupLaunchpadSchema.sections[0].id)
    expect(state.sections).not.toBe(startupLaunchpadSchema.sections)
  })

  it('sectionOrder iniziale matcha sections', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const { sectionOrder, sections } = store.getState()
    expect(sectionOrder).toEqual(sections.map((s) => s.id))
  })
})
```

- [ ] **Step 2: Run — deve fallire (`sections` non esiste)**

Run: `npm test -- sections.test.ts`
Expected: FAIL.

- [ ] **Step 3: Aggiorna `EditorState` interface e snapshot**

In `lib/store/editor.store.ts`, modifica `Snapshot` e `EditorState`:

```ts
interface Snapshot {
  values: TemplateValues
  sectionOrder: string[]
  sections: Section[]
}

export interface EditorState {
  templateId: string
  schema: TemplateSchema
  sections: Section[]
  values: TemplateValues
  sectionOrder: string[]
  elementOrder: Record<string, Record<string, number[]>>
  activeSection: string

  _past: Snapshot[]
  _future: Snapshot[]
  canUndo: boolean
  canRedo: boolean

  updateField: (sectionId: string, fieldId: string, value: unknown) => void
  setActiveSection: (sectionId: string) => void
  reset: () => void
  undo: () => void
  redo: () => void
  exportTemplate: () => {
    schema: TemplateSchema
    sections: Section[]
    values: TemplateValues
    sectionOrder: string[]
    elementOrder: Record<string, Record<string, number[]>>
  }
  reorderSections: (fromIndex: number, toIndex: number) => void
  reorderElements: (sectionId: string, fieldId: string, fromIndex: number, toIndex: number) => void
  getElementOrder: (sectionId: string, fieldId: string) => number[]
}
```

(Import `Section` da `@/lib/schemas/types` se non già fatto.)

- [ ] **Step 4: Aggiorna `loadFromStorage` per leggere `sections`**

Sostituisci:

```ts
function loadFromStorage(templateId: string): { values: TemplateValues; sectionOrder: string[]; elementOrder: Record<string, Record<string, number[]>> } | null {
```

con:

```ts
interface StoredPayload {
  values: TemplateValues
  sectionOrder: string[]
  elementOrder: Record<string, Record<string, number[]>>
  sections?: Section[]
}

function loadFromStorage(templateId: string): StoredPayload | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(`readylayout-${templateId}`)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}
```

- [ ] **Step 5: Aggiorna `saveToStorage` per scrivere `sections`**

Sostituisci la firma di `saveToStorage`:

```ts
function saveToStorage(
  templateId: string,
  values: TemplateValues,
  sectionOrder: string[],
  elementOrder: Record<string, Record<string, number[]>>,
  sections: Section[]
) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      `readylayout-${templateId}`,
      JSON.stringify({ values, sectionOrder, elementOrder, sections })
    )
  } catch {
    // storage full or private browsing — continue silently
  }
}
```

- [ ] **Step 6: Aggiorna `createEditorStore` per init `sections`**

Sostituisci il blocco init in `createEditorStore`:

```ts
export function createEditorStore(schema: TemplateSchema) {
  const defaults = buildDefaults(schema)
  const saved = loadFromStorage(schema.id)
  const defaultSections = structuredClone(schema.sections)
  const initialSections = saved?.sections ?? defaultSections
  const initialValues = saved?.values || structuredClone(defaults)
  const initialSectionOrder = saved?.sectionOrder || initialSections.map((s) => s.id)
  const initialElementOrder = saved?.elementOrder || {}
```

- [ ] **Step 7: Aggiorna lo state ritornato e tutte le chiamate `saveToStorage`**

Aggiungi `sections: initialSections,` allo state. Poi in ogni azione che chiamava `saveToStorage(...)`, aggiungi `state.sections` come ultimo argomento. Esempio per `updateField`:

```ts
saveToStorage(state.templateId, newValues, state.sectionOrder, state.elementOrder, state.sections)
```

Applica lo stesso pattern in: `reset`, `undo`, `redo`, `reorderSections`, `reorderElements`. Nota per `reset`: deve resettare ANCHE `sections` a `defaultSections` (clone fresco) e l'`activeSection` alla prima sezione di default:

```ts
reset: () => {
  const state = get()
  const snapshot: Snapshot = { values: state.values, sectionOrder: state.sectionOrder, sections: state.sections }
  const freshValues = structuredClone(defaults)
  const freshSections = structuredClone(schema.sections)
  const freshOrder = freshSections.map((s) => s.id)
  saveToStorage(schema.id, freshValues, freshOrder, {}, freshSections)
  set({
    values: freshValues,
    sections: freshSections,
    sectionOrder: freshOrder,
    elementOrder: {},
    activeSection: freshSections[0]?.id ?? '',
    _past: [...state._past, snapshot].slice(-HISTORY_LIMIT),
    _future: [],
    canUndo: true,
    canRedo: false,
  })
},
```

- [ ] **Step 8: Aggiorna snapshot in undo/redo per includere `sections`**

Per `undo`:

```ts
undo: () =>
  set((state) => {
    if (state._past.length === 0) return {}
    const prev = state._past[state._past.length - 1]
    const past = state._past.slice(0, -1)
    const snapshot: Snapshot = { values: state.values, sectionOrder: state.sectionOrder, sections: state.sections }
    const future = [snapshot, ...state._future].slice(0, HISTORY_LIMIT)
    saveToStorage(state.templateId, prev.values, prev.sectionOrder, state.elementOrder, prev.sections)
    return {
      values: prev.values,
      sections: prev.sections,
      sectionOrder: prev.sectionOrder,
      _past: past,
      _future: future,
      canUndo: past.length > 0,
      canRedo: true,
    }
  }),
```

Specchio per `redo`:

```ts
redo: () =>
  set((state) => {
    if (state._future.length === 0) return {}
    const next = state._future[0]
    const future = state._future.slice(1)
    const snapshot: Snapshot = { values: state.values, sectionOrder: state.sectionOrder, sections: state.sections }
    const past = [...state._past, snapshot].slice(-HISTORY_LIMIT)
    saveToStorage(state.templateId, next.values, next.sectionOrder, state.elementOrder, next.sections)
    return {
      values: next.values,
      sections: next.sections,
      sectionOrder: next.sectionOrder,
      _past: past,
      _future: future,
      canUndo: true,
      canRedo: future.length > 0,
    }
  }),
```

- [ ] **Step 9: Aggiorna snapshot push in `updateField`, `reorderSections`, `reorderElements`**

Ogni snapshot push deve includere `sections`. Esempio `updateField`:

```ts
const snapshot: Snapshot = { values: state.values, sectionOrder: state.sectionOrder, sections: state.sections }
```

Stesso pattern negli altri due. Nessun'altra modifica necessaria a quelle azioni (non toccano `sections`).

- [ ] **Step 10: Aggiorna `exportTemplate`**

```ts
exportTemplate: () => {
  const state = get()
  return {
    schema: state.schema,
    sections: state.sections,
    values: state.values,
    sectionOrder: state.sectionOrder,
    elementOrder: state.elementOrder,
  }
},
```

- [ ] **Step 11: Run tutti i test dello store**

Run: `npm test -- store`
Expected: tutti PASS (i nuovi + i 4 esistenti che ancora funzionano).

- [ ] **Step 12: Commit**

```bash
git add lib/store/editor.store.ts __tests__/lib/store/sections.test.ts
git commit -m "refactor(store): sections become mutable state with migration"
```

---

### Task 4: Azione `addSection`

**Files:**
- Modify: `lib/store/editor.store.ts`
- Modify: `__tests__/lib/store/sections.test.ts`
- Modify: `lib/presets/layouts.ts` (stub minimo, registry vero in Task 9)

- [ ] **Step 1: Stub minimo del preset registry**

Crea `lib/presets/layouts.ts`:

```ts
import type { BlockType, Section } from '@/lib/schemas/types'

export interface LayoutPreset {
  id: string
  label: string
  category: 'hero' | 'features' | 'content' | 'commerce' | 'social' | 'utility'
  blockType: BlockType
  variant?: string
  build: (uniqueId: string) => Section
  defaultValues: Record<string, unknown>
}

export const LAYOUT_PRESETS: LayoutPreset[] = []

export function getPreset(id: string): LayoutPreset | undefined {
  return LAYOUT_PRESETS.find((p) => p.id === id)
}
```

- [ ] **Step 2: Test fallente per `addSection`**

Aggiungi a `__tests__/lib/store/sections.test.ts`:

```ts
import { LAYOUT_PRESETS } from '@/lib/presets/layouts'
import type { LayoutPreset } from '@/lib/presets/layouts'

const FAKE_PRESET: LayoutPreset = {
  id: 'test-fake',
  label: 'Test fake',
  category: 'hero',
  blockType: 'hero',
  build: (id) => ({
    id,
    label: 'Fake Hero',
    blockType: 'hero',
    fields: [
      { id: 'headline', type: 'text', label: 'Headline', default: 'Default' },
    ],
  }),
  defaultValues: { headline: 'Preset value' },
}

describe('store: addSection', () => {
  beforeEach(() => {
    // Inietta il preset di test
    LAYOUT_PRESETS.length = 0
    LAYOUT_PRESETS.push(FAKE_PRESET)
  })

  it('aggiunge una sezione in coda quando insertAfterId è null', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const before = store.getState().sectionOrder.length
    store.getState().addSection('test-fake', null)
    const state = store.getState()
    expect(state.sectionOrder).toHaveLength(before + 1)
    const newId = state.sectionOrder[state.sectionOrder.length - 1]
    expect(state.sections.find((s) => s.id === newId)).toBeDefined()
    expect(state.values[newId]).toEqual({ headline: 'Preset value' })
  })

  it('inserisce subito dopo insertAfterId', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const firstId = store.getState().sectionOrder[0]
    store.getState().addSection('test-fake', firstId)
    const state = store.getState()
    expect(state.sectionOrder[1]).toMatch(/^hero-[a-z0-9]{6}$/)
  })

  it('imposta la nuova sezione come activeSection', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().addSection('test-fake', null)
    const state = store.getState()
    const newId = state.sectionOrder[state.sectionOrder.length - 1]
    expect(state.activeSection).toBe(newId)
  })

  it('abilita undo dopo addSection', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const before = store.getState().sectionOrder.length
    store.getState().addSection('test-fake', null)
    expect(store.getState().canUndo).toBe(true)
    store.getState().undo()
    expect(store.getState().sectionOrder).toHaveLength(before)
  })

  it('no-op se presetId non esiste', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const before = store.getState().sectionOrder.length
    store.getState().addSection('nonexistent', null)
    expect(store.getState().sectionOrder).toHaveLength(before)
  })
})
```

- [ ] **Step 3: Run — fallisce (addSection non esiste)**

Run: `npm test -- sections.test.ts`
Expected: FAIL.

- [ ] **Step 4: Aggiungi `addSection` allo state interface**

In `lib/store/editor.store.ts`, aggiungi all'interfaccia `EditorState`:

```ts
addSection: (presetId: string, insertAfterId: string | null) => void
```

- [ ] **Step 5: Implementa `addSection` nel store**

In `createEditorStore`, aggiungi prima della chiusura dell'oggetto state:

```ts
addSection: (presetId, insertAfterId) =>
  set((state) => {
    const preset = LAYOUT_PRESETS.find((p) => p.id === presetId)
    if (!preset) return {}

    const taken = new Set(state.sections.map((s) => s.id))
    const newId = uniqueSectionId(preset.blockType, taken)
    const newSection = preset.build(newId)
    const newValues = structuredClone(preset.defaultValues)

    const newSections = [...state.sections, newSection]
    const insertIndex = insertAfterId === null
      ? state.sectionOrder.length
      : state.sectionOrder.indexOf(insertAfterId) + 1
    const newOrder = [...state.sectionOrder]
    newOrder.splice(insertIndex, 0, newId)

    const updatedValues = { ...state.values, [newId]: newValues }
    const snapshot: Snapshot = { values: state.values, sectionOrder: state.sectionOrder, sections: state.sections }
    const past = [...state._past, snapshot].slice(-HISTORY_LIMIT)

    saveToStorage(state.templateId, updatedValues, newOrder, state.elementOrder, newSections)

    return {
      sections: newSections,
      sectionOrder: newOrder,
      values: updatedValues,
      activeSection: newId,
      _past: past,
      _future: [],
      canUndo: true,
      canRedo: false,
    }
  }),
```

Aggiungi gli import in cima al file:

```ts
import { LAYOUT_PRESETS } from '@/lib/presets/layouts'
import { uniqueSectionId } from '@/lib/utils/uniqueId'
import type { Section } from '@/lib/schemas/types'
```

(Adatta gli import esistenti se già presenti.)

- [ ] **Step 6: Run test**

Run: `npm test -- sections.test.ts`
Expected: tutti PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/store/editor.store.ts lib/presets/layouts.ts __tests__/lib/store/sections.test.ts
git commit -m "feat(store): add addSection action with preset registry stub"
```

---

### Task 5: Azione `removeSection`

**Files:**
- Modify: `lib/store/editor.store.ts`
- Modify: `__tests__/lib/store/sections.test.ts`

- [ ] **Step 1: Test fallenti per `removeSection`**

Aggiungi a `__tests__/lib/store/sections.test.ts`:

```ts
describe('store: removeSection', () => {
  beforeEach(() => {
    LAYOUT_PRESETS.length = 0
    LAYOUT_PRESETS.push(FAKE_PRESET)
  })

  it('rimuove una sezione esistente', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().addSection('test-fake', null)
    const newId = store.getState().sectionOrder[store.getState().sectionOrder.length - 1]
    const before = store.getState().sectionOrder.length
    store.getState().removeSection(newId)
    const state = store.getState()
    expect(state.sectionOrder).toHaveLength(before - 1)
    expect(state.sections.find((s) => s.id === newId)).toBeUndefined()
    expect(state.values[newId]).toBeUndefined()
  })

  it('no-op se sectionId è il primo di sectionOrder', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const firstId = store.getState().sectionOrder[0]
    const before = store.getState().sectionOrder.length
    store.getState().removeSection(firstId)
    expect(store.getState().sectionOrder).toHaveLength(before)
  })

  it('sposta activeSection alla precedente se la rimossa era attiva', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().addSection('test-fake', null)
    const newId = store.getState().sectionOrder[store.getState().sectionOrder.length - 1]
    store.getState().setActiveSection(newId)
    store.getState().removeSection(newId)
    expect(store.getState().activeSection).not.toBe(newId)
    expect(store.getState().activeSection).toBeTruthy()
  })

  it('undo ripristina la sezione rimossa', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().addSection('test-fake', null)
    const newId = store.getState().sectionOrder[store.getState().sectionOrder.length - 1]
    store.getState().removeSection(newId)
    store.getState().undo()
    expect(store.getState().sectionOrder).toContain(newId)
  })

  it('rimuove anche elementOrder per la sezione', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().addSection('test-fake', null)
    const newId = store.getState().sectionOrder[store.getState().sectionOrder.length - 1]
    // Simula elementOrder
    store.setState((s) => ({ elementOrder: { ...s.elementOrder, [newId]: { items: [0, 1] } } }))
    store.getState().removeSection(newId)
    expect(store.getState().elementOrder[newId]).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run — deve fallire (`removeSection` non esiste)**

Run: `npm test -- sections.test.ts`
Expected: FAIL.

- [ ] **Step 3: Aggiungi `removeSection` all'interfaccia**

In `EditorState`:

```ts
removeSection: (sectionId: string) => void
```

- [ ] **Step 4: Implementa `removeSection`**

In `createEditorStore`:

```ts
removeSection: (sectionId) =>
  set((state) => {
    // Regola: la prima sezione in sectionOrder non è rimovibile
    if (state.sectionOrder[0] === sectionId) return {}
    const idx = state.sectionOrder.indexOf(sectionId)
    if (idx === -1) return {}

    const snapshot: Snapshot = { values: state.values, sectionOrder: state.sectionOrder, sections: state.sections }
    const past = [...state._past, snapshot].slice(-HISTORY_LIMIT)

    const newOrder = state.sectionOrder.filter((id) => id !== sectionId)
    const newSections = state.sections.filter((s) => s.id !== sectionId)
    const newValues = { ...state.values }
    delete newValues[sectionId]
    const newElementOrder = { ...state.elementOrder }
    delete newElementOrder[sectionId]

    const newActive = state.activeSection === sectionId
      ? newOrder[Math.max(idx - 1, 0)] ?? newOrder[0] ?? ''
      : state.activeSection

    saveToStorage(state.templateId, newValues, newOrder, newElementOrder, newSections)

    return {
      sections: newSections,
      sectionOrder: newOrder,
      values: newValues,
      elementOrder: newElementOrder,
      activeSection: newActive,
      _past: past,
      _future: [],
      canUndo: true,
      canRedo: false,
    }
  }),
```

- [ ] **Step 5: Run test**

Run: `npm test -- sections.test.ts`
Expected: tutti PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/store/editor.store.ts __tests__/lib/store/sections.test.ts
git commit -m "feat(store): add removeSection action with first-pinned rule"
```

---

### Task 6: Azione `duplicateSection`

**Files:**
- Modify: `lib/store/editor.store.ts`
- Modify: `__tests__/lib/store/sections.test.ts`

- [ ] **Step 1: Test fallente**

Aggiungi a `sections.test.ts`:

```ts
describe('store: duplicateSection', () => {
  it('duplica sezione esistente subito dopo l\'originale', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const firstId = store.getState().sectionOrder[0]
    const beforeLen = store.getState().sectionOrder.length
    store.getState().duplicateSection(firstId)
    const state = store.getState()
    expect(state.sectionOrder).toHaveLength(beforeLen + 1)
    expect(state.sectionOrder[1]).not.toBe(firstId)
    const dupId = state.sectionOrder[1]
    const dup = state.sections.find((s) => s.id === dupId)!
    const orig = state.sections.find((s) => s.id === firstId)!
    expect(dup.blockType).toBe(orig.blockType)
    expect(state.values[dupId]).toEqual(state.values[firstId])
    expect(state.values[dupId]).not.toBe(state.values[firstId])
  })

  it('no-op se sectionId non esiste', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const before = store.getState().sectionOrder.length
    store.getState().duplicateSection('nonexistent')
    expect(store.getState().sectionOrder).toHaveLength(before)
  })
})
```

- [ ] **Step 2: Run — deve fallire**

Run: `npm test -- sections.test.ts`
Expected: FAIL.

- [ ] **Step 3: Aggiungi `duplicateSection` all'interfaccia**

```ts
duplicateSection: (sectionId: string) => void
```

- [ ] **Step 4: Implementa**

```ts
duplicateSection: (sectionId) =>
  set((state) => {
    const section = state.sections.find((s) => s.id === sectionId)
    const idx = state.sectionOrder.indexOf(sectionId)
    if (!section || idx === -1) return {}

    const snapshot: Snapshot = { values: state.values, sectionOrder: state.sectionOrder, sections: state.sections }
    const past = [...state._past, snapshot].slice(-HISTORY_LIMIT)

    const taken = new Set(state.sections.map((s) => s.id))
    const newId = uniqueSectionId(section.blockType, taken)
    const dup: Section = structuredClone({ ...section, id: newId })
    const dupValues = structuredClone(state.values[sectionId] ?? {})

    const newSections = [...state.sections, dup]
    const newOrder = [...state.sectionOrder]
    newOrder.splice(idx + 1, 0, newId)
    const newValues = { ...state.values, [newId]: dupValues }

    saveToStorage(state.templateId, newValues, newOrder, state.elementOrder, newSections)

    return {
      sections: newSections,
      sectionOrder: newOrder,
      values: newValues,
      _past: past,
      _future: [],
      canUndo: true,
      canRedo: false,
    }
  }),
```

- [ ] **Step 5: Run test**

Run: `npm test -- sections.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/store/editor.store.ts __tests__/lib/store/sections.test.ts
git commit -m "feat(store): add duplicateSection action (no UI yet)"
```

---

### Task 7: `BlockRenderer` accetta+passa `variant` (no-op visivo)

**Files:**
- Modify: `components/blocks/BlockRenderer.tsx`

- [ ] **Step 1: Aggiorna BlockRenderer**

Sostituisci tutto il contenuto di `components/blocks/BlockRenderer.tsx` con:

```tsx
import type { BlockType } from '@/lib/schemas/types'
import { Hero } from './Hero'
import { Features } from './Features'
import { Pricing } from './Pricing'
import { FAQ } from './FAQ'
import { CTA } from './CTA'
import { About } from './About'
import { Gallery } from './Gallery'
import { Articles } from './Articles'
import { ContactForm } from './ContactForm'
import { LinkList } from './LinkList'
import { Menu } from './Menu'
import { Products } from './Products'
import { Testimonials } from './Testimonials'
import { Stats } from './Stats'
import { Schedule } from './Schedule'
import { TextBlock } from './TextBlock'

type AnyProps = Record<string, unknown> & { _sectionId: string; _variant?: string }

const registry: Record<BlockType, (props: AnyProps) => React.ReactElement> = {
  hero: Hero as unknown as (props: AnyProps) => React.ReactElement,
  features: Features as unknown as (props: AnyProps) => React.ReactElement,
  pricing: Pricing as unknown as (props: AnyProps) => React.ReactElement,
  faq: FAQ as unknown as (props: AnyProps) => React.ReactElement,
  cta: CTA as unknown as (props: AnyProps) => React.ReactElement,
  about: About as unknown as (props: AnyProps) => React.ReactElement,
  gallery: Gallery as unknown as (props: AnyProps) => React.ReactElement,
  articles: Articles as unknown as (props: AnyProps) => React.ReactElement,
  contact: ContactForm as unknown as (props: AnyProps) => React.ReactElement,
  linklist: LinkList as unknown as (props: AnyProps) => React.ReactElement,
  menu: Menu as unknown as (props: AnyProps) => React.ReactElement,
  products: Products as unknown as (props: AnyProps) => React.ReactElement,
  testimonials: Testimonials as unknown as (props: AnyProps) => React.ReactElement,
  stats: Stats as unknown as (props: AnyProps) => React.ReactElement,
  schedule: Schedule as unknown as (props: AnyProps) => React.ReactElement,
  textblock: TextBlock as unknown as (props: AnyProps) => React.ReactElement,
}

interface BlockRendererProps {
  blockType: BlockType
  sectionId: string
  values: Record<string, unknown>
  variant?: string
}

export function BlockRenderer({ blockType, sectionId, values, variant }: BlockRendererProps) {
  const Block = registry[blockType]
  if (!Block) return null
  return <Block {...values} _sectionId={sectionId} _variant={variant} />
}
```

Note: i block components ignorano `_variant` per ora (Plan 2 lo userà). Il prop transita comunque per ridurre il churn in Plan 2.

- [ ] **Step 2: Verifica type-check**

Run: `npx tsc --noEmit`
Expected: pass (i block accettano props extra senza errori grazie al cast `as unknown as`).

- [ ] **Step 3: Verifica visiva — dev server**

Run: `npm run dev` (background) e apri `http://localhost:3000/editor/startup-launchpad`. Confronta visivamente con git stash: nessun cambiamento visibile.

- [ ] **Step 4: Commit**

```bash
git add components/blocks/BlockRenderer.tsx
git commit -m "feat(blocks): BlockRenderer accepts variant prop (passthrough only)"
```

---

### Task 8: TemplateRenderer legge `sections` dallo store

**Files:**
- Modify: `components/TemplateRenderer.tsx`

- [ ] **Step 1: Refactor TemplateRenderer**

In `components/TemplateRenderer.tsx`, modifica per leggere le sezioni dallo store quando `editable`. Sostituisci la firma e il body editable:

```tsx
'use client'

import { useState, useRef } from 'react'
import type { TemplateSchema, TemplateValues, Section } from '@/lib/schemas/types'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { useEditorStore, useIsEditorContext } from '@/lib/store/editor-context'
import { GripVertical } from 'lucide-react'

interface TemplateRendererProps {
  schema: TemplateSchema
  values: TemplateValues
  editable?: boolean
}

export function TemplateRenderer({ schema, values, editable = true }: TemplateRendererProps) {
  if (!editable) {
    return (
      <div className="font-sans" data-template={schema.id}>
        {schema.sections.map((section) => (
          <section key={section.id} data-section={section.id}>
            <BlockRenderer
              blockType={section.blockType}
              sectionId={section.id}
              values={values[section.id] ?? {}}
              variant={section.variant}
            />
          </section>
        ))}
      </div>
    )
  }
  return <EditableTemplate schema={schema} values={values} />
}

function EditableTemplate({ schema, values }: { schema: TemplateSchema; values: TemplateValues }) {
  const storeSections = useEditorStore((s) => s.sections)
  const sectionOrder = useEditorStore((s) => s.sectionOrder)

  const orderedSections: Section[] = sectionOrder
    .map((id) => storeSections.find((s) => s.id === id))
    .filter((s): s is Section => s !== undefined)

  return (
    <div className="font-sans" data-template={schema.id}>
      {orderedSections.map((section, index) => (
        <DraggableSection
          key={section.id}
          section={section}
          values={values[section.id] ?? {}}
          index={index}
        />
      ))}
    </div>
  )
}

interface DraggableSectionProps {
  section: Section
  values: Record<string, unknown>
  index: number
}
```

Il body di `DraggableSection` resta com'è ma passa `variant`:

```tsx
<BlockRenderer
  blockType={section.blockType}
  sectionId={section.id}
  values={values}
  variant={section.variant}
/>
```

(Cerca la riga con `<BlockRenderer` dentro `DraggableSection` e aggiungi `variant={section.variant}`.)

- [ ] **Step 2: Verifica che `CanvasContent.tsx` non rompa**

Apri `app/canvas/[templateId]/CanvasContent.tsx` riga 67-69 — usa `sectionOrder` per ordinare `schema.sections`. Sostituisci quel blocco e il prop passato a TemplateRenderer:

```tsx
function CanvasRenderer() {
  const schema = useEditorStore(s => s.schema)
  const values = useEditorStore(s => s.values)
  const [fontFamily, setFontFamily] = useState('')

  useEffect(() => {
    setFontFamily(localStorage.getItem('readylayout-font') || '')

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'readylayout-font') setFontFamily(e.newValue || '')
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <div style={{ fontFamily: fontFamily || 'inherit', margin: 0, padding: 0 }}>
      <InlineEditor>
        <ImageEditor>
          <TemplateRenderer schema={schema} values={values} />
        </ImageEditor>
      </InlineEditor>
    </div>
  )
}
```

Rimuovi `sectionOrder` selector e la logica di filtro/ricostruzione — ora vive in `TemplateRenderer`.

- [ ] **Step 3: Run type-check + dev server**

Run: `npx tsc --noEmit`
Expected: pass.

Run: `npm run dev` e verifica che `/editor/startup-launchpad` renderizzi correttamente.

- [ ] **Step 4: Commit**

```bash
git add components/TemplateRenderer.tsx app/canvas/[templateId]/CanvasContent.tsx
git commit -m "refactor(canvas): TemplateRenderer reads sections from store"
```

---

### Task 9: Sync `sections` su storage events (cross-iframe)

**Files:**
- Modify: `lib/store/editor-context.tsx`
- Modify: `app/canvas/[templateId]/CanvasContent.tsx` (lo `StorageSyncer`)

- [ ] **Step 1: Aggiorna `editor-context.tsx`**

In `lib/store/editor-context.tsx`, sostituisci il body dell'effect dentro `EditorProvider`:

```tsx
useEffect(() => {
  const key = `readylayout-${schema.id}`
  const handleStorage = (e: StorageEvent) => {
    if (e.key !== key || !e.newValue) return
    try {
      const { values, sectionOrder, elementOrder, sections } = JSON.parse(e.newValue)
      store.setState({
        values,
        sectionOrder,
        elementOrder: elementOrder ?? {},
        ...(sections ? { sections } : {}),
      })
    } catch {}
  }
  window.addEventListener('storage', handleStorage)
  return () => window.removeEventListener('storage', handleStorage)
}, [store, schema.id])
```

- [ ] **Step 2: Aggiorna `StorageSyncer` in `CanvasContent.tsx`**

Sostituisci il body dell'effect dentro `StorageSyncer`:

```tsx
useEffect(() => {
  const { schema } = storeApi.getState()
  const key = `readylayout-${schema.id}`

  const handleStorage = (e: StorageEvent) => {
    if (e.key !== key || !e.newValue) return
    try {
      const { values, sectionOrder, elementOrder, sections } = JSON.parse(e.newValue)
      storeApi.setState({
        values,
        sectionOrder,
        elementOrder: elementOrder ?? {},
        ...(sections ? { sections } : {}),
      })
    } catch {}
  }

  window.addEventListener('storage', handleStorage)
  return () => window.removeEventListener('storage', handleStorage)
}, [storeApi])
```

- [ ] **Step 3: Verifica type-check**

Run: `npx tsc --noEmit`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add lib/store/editor-context.tsx app/canvas/[templateId]/CanvasContent.tsx
git commit -m "feat(sync): propagate sections across iframe via storage events"
```

---

## Phase 2 — Presets registry

### Task 10: Popola `LAYOUT_PRESETS` con 8 preset iniziali

**Files:**
- Modify: `lib/presets/layouts.ts`
- Create: `__tests__/lib/presets/layouts.test.ts`

- [ ] **Step 1: Test fallente sui preset**

Crea `__tests__/lib/presets/layouts.test.ts`:

```ts
import { LAYOUT_PRESETS, getPreset } from '@/lib/presets/layouts'

describe('LAYOUT_PRESETS', () => {
  it('contiene almeno 8 preset', () => {
    expect(LAYOUT_PRESETS.length).toBeGreaterThanOrEqual(8)
  })

  it('ogni preset ha id univoco', () => {
    const ids = LAYOUT_PRESETS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('ogni preset.build produce una Section con i field richiesti', () => {
    for (const preset of LAYOUT_PRESETS) {
      const section = preset.build('test-id')
      expect(section.id).toBe('test-id')
      expect(section.blockType).toBe(preset.blockType)
      expect(Array.isArray(section.fields)).toBe(true)
      // defaultValues deve avere chiavi che sono field.id validi
      for (const key of Object.keys(preset.defaultValues)) {
        const field = section.fields.find((f) => f.id === key)
        expect(field).toBeDefined()
      }
    }
  })

  it('getPreset trova per id', () => {
    const first = LAYOUT_PRESETS[0]
    expect(getPreset(first.id)).toBe(first)
    expect(getPreset('nonexistent')).toBeUndefined()
  })

  it('copre i blockType principali', () => {
    const blockTypes = new Set(LAYOUT_PRESETS.map((p) => p.blockType))
    expect(blockTypes.has('hero')).toBe(true)
    expect(blockTypes.has('features')).toBe(true)
    expect(blockTypes.has('about')).toBe(true)
    expect(blockTypes.has('cta')).toBe(true)
  })
})
```

- [ ] **Step 2: Run — fallisce (LAYOUT_PRESETS vuoto)**

Run: `npm test -- layouts.test.ts`
Expected: FAIL.

- [ ] **Step 3: Riempi LAYOUT_PRESETS**

Sostituisci `lib/presets/layouts.ts` con la versione completa. Nota: i field schemas seguono lo stesso shape dei template esistenti (es. `lib/schemas/startup-launchpad.ts` per Hero, `bistro.ts` per About).

```ts
import type { BlockType, Section } from '@/lib/schemas/types'

export interface LayoutPreset {
  id: string
  label: string
  category: 'hero' | 'features' | 'content' | 'commerce' | 'social' | 'utility'
  blockType: BlockType
  variant?: string
  build: (uniqueId: string) => Section
  defaultValues: Record<string, unknown>
}

// Helper per ridurre boilerplate: stessi field schemas dei template esistenti
const heroFields: Section['fields'] = [
  { id: 'headline',    type: 'text',  label: 'Titolo principale', default: 'Titolo' },
  { id: 'subheadline', type: 'text',  label: 'Sottotitolo',       default: 'Sottotitolo', multiline: true },
  { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA',         default: 'Inizia' },
  { id: 'bgColor',     type: 'color', label: 'Sfondo',            default: '#0f172a' },
  { id: 'textColor',   type: 'color', label: 'Testo',             default: '#f8fafc' },
  { id: 'accentColor', type: 'color', label: 'Colore accento',    default: '#3b82f6' },
]

const featuresFields: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Funzionalità' },
  { id: 'subtext',      type: 'text', label: 'Sottotitolo', default: '', multiline: true },
  { id: 'bgColor',      type: 'color', label: 'Sfondo', default: '#ffffff' },
  { id: 'textColor',    type: 'color', label: 'Testo', default: '#0f172a' },
  {
    id: 'items',
    type: 'repeater',
    label: 'Funzionalità',
    default: [
      { icon: '⚡', title: 'Veloce', body: 'Performance eccellente.' },
      { icon: '🎯', title: 'Preciso', body: 'Risultati accurati.' },
      { icon: '🔒', title: 'Sicuro', body: 'Dati protetti.' },
    ],
    itemSchema: [
      { id: 'icon',  type: 'emoji', label: 'Icona', default: '✦' },
      { id: 'title', type: 'text',  label: 'Titolo', default: 'Titolo' },
      { id: 'body',  type: 'text',  label: 'Descrizione', default: 'Descrizione' },
    ],
  },
]

const aboutFields: Section['fields'] = [
  { id: 'eyebrow',   type: 'text',  label: 'Occhiello',  default: 'About' },
  { id: 'headline',  type: 'text',  label: 'Titolo',     default: 'Chi siamo' },
  { id: 'body',      type: 'text',  label: 'Corpo testo', default: 'Racconta la tua storia.', multiline: true },
  { id: 'image',     type: 'image', label: 'Immagine',   default: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
  { id: 'bgColor',   type: 'color', label: 'Sfondo',     default: '#f8fafc' },
  { id: 'textColor', type: 'color', label: 'Testo',      default: '#0f172a' },
]

const ctaFields: Section['fields'] = [
  { id: 'headline',    type: 'text',  label: 'Titolo',  default: 'Pronto a iniziare?' },
  { id: 'subheadline', type: 'text',  label: 'Sottotitolo', default: 'Unisciti a chi ha già scelto.', multiline: true },
  { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA', default: 'Inizia ora' },
  { id: 'bgColor',     type: 'color', label: 'Sfondo', default: '#0f172a' },
  { id: 'textColor',   type: 'color', label: 'Testo', default: '#f8fafc' },
  { id: 'accentColor', type: 'color', label: 'Accento', default: '#3b82f6' },
]

const faqFields: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo', default: 'Domande frequenti' },
  { id: 'bgColor',      type: 'color', label: 'Sfondo', default: '#ffffff' },
  { id: 'textColor',    type: 'color', label: 'Testo', default: '#0f172a' },
  {
    id: 'items', type: 'repeater', label: 'Domande',
    default: [
      { question: 'Come funziona?', answer: 'Risposta alla domanda.' },
      { question: 'Quanto costa?', answer: 'Risposta alla domanda.' },
    ],
    itemSchema: [
      { id: 'question', type: 'text', label: 'Domanda', default: 'Domanda?' },
      { id: 'answer',   type: 'text', label: 'Risposta', default: 'Risposta.' },
    ],
  },
]

const pricingFields: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo', default: 'Prezzi' },
  { id: 'subtext',      type: 'text', label: 'Sottotitolo', default: 'Scegli il piano.', multiline: true },
  { id: 'bgColor',      type: 'color', label: 'Sfondo', default: '#ffffff' },
  { id: 'textColor',    type: 'color', label: 'Testo', default: '#0f172a' },
  { id: 'accentColor',  type: 'color', label: 'Accento', default: '#3b82f6' },
  {
    id: 'plans', type: 'repeater', label: 'Piani',
    default: [
      { name: 'Base',  price: '9€', period: '/mese', features: 'Caratteristica 1\nCaratteristica 2', ctaLabel: 'Scegli' },
      { name: 'Pro',   price: '29€', period: '/mese', features: 'Tutto di Base\nCaratteristica extra', ctaLabel: 'Scegli' },
      { name: 'Team',  price: '99€', period: '/mese', features: 'Tutto di Pro\nUtenti illimitati', ctaLabel: 'Scegli' },
    ],
    itemSchema: [
      { id: 'name',     type: 'text', label: 'Nome', default: 'Piano' },
      { id: 'price',    type: 'text', label: 'Prezzo', default: '9€' },
      { id: 'period',   type: 'text', label: 'Periodo', default: '/mese' },
      { id: 'features', type: 'text', label: 'Caratteristiche', default: '' },
      { id: 'ctaLabel', type: 'text', label: 'CTA', default: 'Scegli' },
    ],
  },
]

const testimonialsFields: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo', default: 'Dicono di noi' },
  { id: 'bgColor',      type: 'color', label: 'Sfondo', default: '#f8fafc' },
  { id: 'textColor',    type: 'color', label: 'Testo', default: '#0f172a' },
  {
    id: 'items', type: 'repeater', label: 'Testimonianze',
    default: [
      { quote: 'Servizio eccellente.', author: 'Mario Rossi', role: 'Cliente' },
      { quote: 'Lo consiglio a tutti.', author: 'Giulia Bianchi', role: 'Cliente' },
    ],
    itemSchema: [
      { id: 'quote',  type: 'text', label: 'Citazione', default: '"..."', multiline: true },
      { id: 'author', type: 'text', label: 'Autore', default: 'Nome' },
      { id: 'role',   type: 'text', label: 'Ruolo', default: 'Cliente' },
    ],
  },
]

const statsFields: Section['fields'] = [
  { id: 'bgColor',   type: 'color', label: 'Sfondo', default: '#0f172a' },
  { id: 'textColor', type: 'color', label: 'Testo', default: '#f8fafc' },
  {
    id: 'items', type: 'repeater', label: 'Statistiche',
    default: [
      { value: '10k+', label: 'Utenti' },
      { value: '99%',  label: 'Soddisfazione' },
      { value: '24/7', label: 'Supporto' },
    ],
    itemSchema: [
      { id: 'value', type: 'text', label: 'Valore', default: '0' },
      { id: 'label', type: 'text', label: 'Etichetta', default: 'Etichetta' },
    ],
  },
]

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: 'hero-default',
    label: 'Hero · classico',
    category: 'hero',
    blockType: 'hero',
    build: (id) => ({ id, label: 'Hero', blockType: 'hero', fields: heroFields }),
    defaultValues: {
      headline: 'Il prodotto che cambia\ntutto.',
      subheadline: 'Spiegazione breve e diretta del valore offerto.',
      ctaLabel: 'Inizia gratis',
      bgColor: '#0f172a',
      textColor: '#f8fafc',
      accentColor: '#3b82f6',
    },
  },
  {
    id: 'features-grid-3',
    label: 'Features · griglia 3 colonne',
    category: 'features',
    blockType: 'features',
    build: (id) => ({ id, label: 'Funzionalità', blockType: 'features', fields: featuresFields }),
    defaultValues: {
      sectionTitle: 'Tutto quello che serve',
      subtext: 'Tre punti chiave della tua offerta.',
      bgColor: '#ffffff',
      textColor: '#0f172a',
      items: [
        { icon: '⚡', title: 'Veloce', body: 'Performance eccellente.' },
        { icon: '🎯', title: 'Preciso', body: 'Risultati accurati.' },
        { icon: '🔒', title: 'Sicuro', body: 'Dati protetti.' },
      ],
    },
  },
  {
    id: 'about-image-right',
    label: 'About · immagine a destra',
    category: 'content',
    blockType: 'about',
    build: (id) => ({ id, label: 'Chi siamo', blockType: 'about', fields: aboutFields }),
    defaultValues: {
      eyebrow: 'About',
      headline: 'La nostra storia',
      body: 'Racconta da dove vieni e cosa ti rende unico.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      bgColor: '#f8fafc',
      textColor: '#0f172a',
    },
  },
  {
    id: 'cta-centered',
    label: 'CTA · centrata',
    category: 'utility',
    blockType: 'cta',
    build: (id) => ({ id, label: 'Call to Action', blockType: 'cta', fields: ctaFields }),
    defaultValues: {
      headline: 'Pronto a iniziare?',
      subheadline: 'Unisciti a chi ha già scelto.',
      ctaLabel: 'Inizia ora',
      bgColor: '#0f172a',
      textColor: '#f8fafc',
      accentColor: '#3b82f6',
    },
  },
  {
    id: 'faq-accordion',
    label: 'FAQ · accordion',
    category: 'content',
    blockType: 'faq',
    build: (id) => ({ id, label: 'FAQ', blockType: 'faq', fields: faqFields }),
    defaultValues: {
      sectionTitle: 'Domande frequenti',
      bgColor: '#ffffff',
      textColor: '#0f172a',
      items: [
        { question: 'Come funziona?', answer: 'Risposta chiara.' },
        { question: 'Quanto costa?', answer: 'Risposta chiara.' },
        { question: 'Posso disdire?', answer: 'Sì, in qualsiasi momento.' },
      ],
    },
  },
  {
    id: 'pricing-three-tier',
    label: 'Pricing · 3 piani',
    category: 'commerce',
    blockType: 'pricing',
    build: (id) => ({ id, label: 'Prezzi', blockType: 'pricing', fields: pricingFields }),
    defaultValues: {
      sectionTitle: 'Prezzi semplici',
      subtext: 'Scegli il piano giusto per te.',
      bgColor: '#ffffff',
      textColor: '#0f172a',
      accentColor: '#3b82f6',
      plans: [
        { name: 'Base',  price: '9€',  period: '/mese', features: 'Funzione 1\nFunzione 2', ctaLabel: 'Scegli' },
        { name: 'Pro',   price: '29€', period: '/mese', features: 'Tutto di Base\nFunzione extra', ctaLabel: 'Scegli' },
        { name: 'Team',  price: '99€', period: '/mese', features: 'Tutto di Pro\nUtenti illimitati', ctaLabel: 'Scegli' },
      ],
    },
  },
  {
    id: 'testimonials-grid',
    label: 'Testimonianze · griglia',
    category: 'social',
    blockType: 'testimonials',
    build: (id) => ({ id, label: 'Testimonianze', blockType: 'testimonials', fields: testimonialsFields }),
    defaultValues: {
      sectionTitle: 'Dicono di noi',
      bgColor: '#f8fafc',
      textColor: '#0f172a',
      items: [
        { quote: '"Esperienza straordinaria."', author: 'Mario Rossi', role: 'CEO' },
        { quote: '"Lo consiglio a tutti."', author: 'Giulia Bianchi', role: 'Designer' },
      ],
    },
  },
  {
    id: 'stats-inline',
    label: 'Statistiche · inline',
    category: 'social',
    blockType: 'stats',
    build: (id) => ({ id, label: 'Statistiche', blockType: 'stats', fields: statsFields }),
    defaultValues: {
      bgColor: '#0f172a',
      textColor: '#f8fafc',
      items: [
        { value: '10k+', label: 'Utenti attivi' },
        { value: '99%',  label: 'Uptime' },
        { value: '24/7', label: 'Supporto' },
      ],
    },
  },
]

export function getPreset(id: string): LayoutPreset | undefined {
  return LAYOUT_PRESETS.find((p) => p.id === id)
}
```

- [ ] **Step 4: Run test**

Run: `npm test -- layouts.test.ts`
Expected: PASS.

- [ ] **Step 5: Run TUTTI i test del store (i preset reali non rompono i test del store)**

Run: `npm test`
Expected: tutti PASS. I test del store hanno `beforeEach` che svuota e re-popola `LAYOUT_PRESETS` — restano corretti.

- [ ] **Step 6: Commit**

```bash
git add lib/presets/layouts.ts __tests__/lib/presets/layouts.test.ts
git commit -m "feat(presets): seed registry with 8 initial layout presets"
```

---

## Phase 3 — UI: Picker, Inserter, Sidebar controls

### Task 11: `<LayoutPickerModal>` — shell modale

**Files:**
- Create: `components/editor/LayoutPicker.tsx`

- [ ] **Step 1: Crea il componente**

Crea `components/editor/LayoutPicker.tsx`:

```tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useEditorStore } from '@/lib/store/editor-context'
import { LAYOUT_PRESETS, type LayoutPreset } from '@/lib/presets/layouts'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

interface LayoutPickerProps {
  open: boolean
  insertAfterId: string | null
  onClose: () => void
}

const CATEGORIES: { value: LayoutPreset['category'] | 'all'; label: string }[] = [
  { value: 'all',       label: 'Tutti' },
  { value: 'hero',      label: 'Hero' },
  { value: 'features',  label: 'Features' },
  { value: 'content',   label: 'Content' },
  { value: 'commerce',  label: 'Commerce' },
  { value: 'social',    label: 'Social' },
  { value: 'utility',   label: 'Utility' },
]

export function LayoutPicker({ open, insertAfterId, onClose }: LayoutPickerProps) {
  const addSection = useEditorStore((s) => s.addSection)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<LayoutPreset['category'] | 'all'>('all')

  // ESC chiude
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Reset filtri quando si chiude
  useEffect(() => {
    if (!open) {
      setQuery('')
      setCategory('all')
    }
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LAYOUT_PRESETS.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (q && !p.label.toLowerCase().includes(q)) return false
      return true
    })
  }, [query, category])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Aggiungi sezione"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgb(0 0 0 / 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 960,
          maxWidth: '90vw',
          maxHeight: '80vh',
          background: 'var(--ed-panel)',
          borderRadius: 12,
          boxShadow: '0 30px 60px -20px rgb(0 0 0 / 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--ed-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--ed-primary)' }}>
            Aggiungi sezione
          </div>
          <button
            onClick={onClose}
            aria-label="Chiudi"
            className="ed-press"
            style={{
              fontSize: 22,
              lineHeight: 1,
              color: 'var(--ed-muted)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        {/* Toolbar */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--ed-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca un layout…"
            className="ed-input"
            style={{ fontSize: 14, padding: '8px 12px' }}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className="ed-press"
                style={{
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 500,
                  background: category === c.value ? 'var(--ed-accent-surface)' : 'transparent',
                  color: category === c.value ? 'var(--ed-accent-text)' : 'var(--ed-secondary)',
                  border: '1px solid ' + (category === c.value ? 'transparent' : 'var(--ed-border)'),
                  cursor: 'pointer',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--ed-muted)' }}>
              Nessun layout trovato
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 16,
            }}>
              {filtered.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  onClick={() => {
                    addSection(preset.id, insertAfterId)
                    onClose()
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PresetCard({ preset, onClick }: { preset: LayoutPreset; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ed-press"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        background: 'var(--ed-bg)',
        border: '1px solid var(--ed-border)',
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'pointer',
        textAlign: 'left',
        padding: 0,
        transition: 'border-color var(--dur-hover) var(--ease-out), transform var(--dur-hover) var(--ease-out)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--ed-accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--ed-border)'
      }}
    >
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
      {/* Label */}
      <div style={{
        padding: '10px 12px',
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--ed-primary)',
        borderTop: '1px solid var(--ed-border-subtle)',
      }}>
        {preset.label}
      </div>
    </button>
  )
}
```

- [ ] **Step 2: Verifica type-check**

Run: `npx tsc --noEmit`
Expected: pass.

- [ ] **Step 3: Smoke test manuale temporaneo**

Aggiungi temporaneamente in `app/editor/[templateId]/page.tsx` (o un client component sotto) un bottone che monta `<LayoutPicker open={true} insertAfterId={null} onClose={() => {}} />` per verificare visualmente. Apri `http://localhost:3000/editor/startup-launchpad` — il modal deve apparire con 8 card e mini-render funzionanti. **Rimuovi il test temporaneo prima di committare.**

- [ ] **Step 4: Commit**

```bash
git add components/editor/LayoutPicker.tsx
git commit -m "feat(editor): LayoutPicker modal with search, filter and live previews"
```

---

### Task 12: `<SectionInserter>` — drop-zone inline nel canvas

**Files:**
- Create: `components/editor/SectionInserter.tsx`

- [ ] **Step 1: Crea il componente**

Crea `components/editor/SectionInserter.tsx`:

```tsx
'use client'

import { useState } from 'react'

interface SectionInserterProps {
  onClick: () => void
}

export function SectionInserter({ onClick }: SectionInserterProps) {
  const [hover, setHover] = useState(false)

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
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {/* Linea orizzontale */}
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
      {/* Pillola bottone */}
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
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/editor/SectionInserter.tsx
git commit -m "feat(editor): SectionInserter inline drop-zone component"
```

---

### Task 13: Wire SectionInserter + LayoutPicker dentro TemplateRenderer

**Files:**
- Modify: `components/TemplateRenderer.tsx`

- [ ] **Step 1: Aggiungi stato + inseritori in `EditableTemplate`**

Sostituisci `EditableTemplate` con:

```tsx
function EditableTemplate({ schema, values }: { schema: TemplateSchema; values: TemplateValues }) {
  const storeSections = useEditorStore((s) => s.sections)
  const sectionOrder = useEditorStore((s) => s.sectionOrder)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [insertAfterId, setInsertAfterId] = useState<string | null>(null)

  const orderedSections: Section[] = sectionOrder
    .map((id) => storeSections.find((s) => s.id === id))
    .filter((s): s is Section => s !== undefined)

  const openPicker = (afterId: string | null) => {
    setInsertAfterId(afterId)
    setPickerOpen(true)
  }

  return (
    <div className="font-sans" data-template={schema.id}>
      {/* Inserter sopra la prima sezione */}
      <SectionInserter onClick={() => openPicker(null)} />
      {orderedSections.map((section, index) => {
        const prevId = index === 0 ? null : orderedSections[index - 1].id
        return (
          <div key={section.id}>
            {index > 0 && <SectionInserter onClick={() => openPicker(prevId)} />}
            <DraggableSection section={section} values={values[section.id] ?? {}} index={index} />
          </div>
        )
      })}
      {/* Inserter sotto l'ultima sezione */}
      {orderedSections.length > 0 && (
        <SectionInserter onClick={() => openPicker(orderedSections[orderedSections.length - 1].id)} />
      )}
      <LayoutPicker
        open={pickerOpen}
        insertAfterId={insertAfterId}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  )
}
```

Nota la correzione sull'inserter sopra la prima sezione: passa `null` come `insertAfterId` (sì, "sopra la prima sezione" = inserisci all'inizio di sectionOrder). Adatta: usa `null` per "sopra hero" e l'id della sezione precedente per gli inserter intermedi.

Aggiungi gli import in cima al file:

```tsx
import { SectionInserter } from './editor/SectionInserter'
import { LayoutPicker } from './editor/LayoutPicker'
```

**Importante**: l'inserter "sopra hero" attualmente passa `null`, ma `addSection(_, null)` inserisce **in coda**. Bisogna gestire il caso "inserisci all'inizio". Aggiorna `addSection` per supportare un sentinel speciale "all'inizio". Cambia la semantica: `insertAfterId === null` → in coda, `insertAfterId === ''` (stringa vuota) → all'inizio. Modifica TemplateRenderer:

```tsx
{/* Inserter sopra la prima sezione */}
<SectionInserter onClick={() => openPicker('')} />
```

E in `lib/store/editor.store.ts`, modifica `addSection`:

```ts
const insertIndex =
  insertAfterId === null
    ? state.sectionOrder.length
    : insertAfterId === ''
    ? 0
    : state.sectionOrder.indexOf(insertAfterId) + 1
```

Aggiungi un test in `__tests__/lib/store/sections.test.ts`:

```ts
it('insertAfterId === "" inserisce all\'inizio', () => {
  const store = createEditorStore(startupLaunchpadSchema)
  store.getState().addSection('test-fake', '')
  const state = store.getState()
  expect(state.sectionOrder[0]).toMatch(/^hero-[a-z0-9]{6}$/)
})
```

Run: `npm test -- sections.test.ts`
Expected: PASS.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: pass.

- [ ] **Step 3: Smoke test dev server**

Run: `npm run dev` (background).
Apri `http://localhost:3000/editor/startup-launchpad`. Verifica:
- `+` invisibile a riposo tra le sezioni
- Hover sull'area tra due sezioni → linea + pillola appaiono
- Click → modal apre
- Click su una card → nuova sezione appare nel canvas in posizione corretta
- Modal si chiude

- [ ] **Step 4: Commit**

```bash
git add components/TemplateRenderer.tsx lib/store/editor.store.ts __tests__/lib/store/sections.test.ts
git commit -m "feat(editor): wire SectionInserter+LayoutPicker into canvas"
```

---

### Task 14: Sidebar — bottone "Aggiungi sezione"

**Files:**
- Modify: `components/editor/Sidebar.tsx`

- [ ] **Step 1: Aggiungi state per il picker nel Sidebar**

In `components/editor/Sidebar.tsx`, dentro `export function Sidebar()`, aggiungi prima del return:

```tsx
const sections = useEditorStore((s) => s.sections)
const sectionOrder = useEditorStore((s) => s.sectionOrder)
const removeSection = useEditorStore((s) => s.removeSection)
const [pickerOpen, setPickerOpen] = useState(false)
const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null)
```

Sostituisci la lettura locale `schema.sections.map(...)` con la lettura ordinata da `sectionOrder`:

```tsx
const orderedSections = sectionOrder
  .map((id) => sections.find((s) => s.id === id))
  .filter((s): s is NonNullable<typeof s> => s !== undefined)
```

Sostituisci il `.map` esistente su `schema.sections` (riga ~121) con `orderedSections.map(...)`. Nota: il `section` qui ora è il vero record dello store, non più dello schema statico.

- [ ] **Step 2: Aggiungi bottone "Aggiungi sezione" in fondo alla lista**

Subito dopo il `</div>` di chiusura del div che contiene la `.map`, aggiungi:

```tsx
<button
  onClick={() => setPickerOpen(true)}
  className="ed-press"
  style={{
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '7px 10px',
    borderRadius: 6,
    background: 'transparent',
    border: '1px dashed var(--ed-border)',
    color: 'var(--ed-secondary)',
    fontFamily: 'inherit',
    fontSize: 12,
    fontWeight: 500,
    width: '100%',
    cursor: 'pointer',
    transition: 'background var(--dur-hover) var(--ease-out), border-color var(--dur-hover) var(--ease-out)',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = 'var(--ed-bg)'
    e.currentTarget.style.borderColor = 'var(--ed-accent)'
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = 'transparent'
    e.currentTarget.style.borderColor = 'var(--ed-border)'
  }}
>
  <span style={{ fontSize: 14, lineHeight: 1 }}>+</span>
  Aggiungi sezione
</button>
```

- [ ] **Step 3: Renderizza `<LayoutPicker>` nel Sidebar**

In fondo al JSX della `Sidebar`, prima del `</aside>` di chiusura, aggiungi:

```tsx
<LayoutPicker
  open={pickerOpen}
  insertAfterId={orderedSections.length > 0 ? orderedSections[orderedSections.length - 1].id : null}
  onClose={() => setPickerOpen(false)}
/>
```

Import in cima al file:

```tsx
import { LayoutPicker } from './LayoutPicker'
```

- [ ] **Step 4: Smoke test dev server**

Run: `npm run dev` (se non già aperto).
Apri `http://localhost:3000/editor/startup-launchpad`. Verifica:
- Bottone "+ Aggiungi sezione" appare in fondo alla lista del sidebar
- Click apre il modal
- Click su una card aggiunge la sezione in coda

- [ ] **Step 5: Commit**

```bash
git add components/editor/Sidebar.tsx
git commit -m "feat(sidebar): add 'Aggiungi sezione' button"
```

---

### Task 15: Sidebar — `×` rimuovi con conferma inline

**Files:**
- Modify: `components/editor/Sidebar.tsx`

- [ ] **Step 1: Modifica il `<button>` per ogni sezione del sidebar**

Nel `.map` di `orderedSections` (Sidebar.tsx), sostituisci il `<button>` esistente con un wrapper che ospita anche la `×`. Il bottone della sezione resta cliccabile per selezionare; la `×` è un secondo elemento. La `×` è nascosta a meno che la sezione non sia rimovibile (non è la prima di `sectionOrder`).

Sostituisci tutto il body del `.map` con:

```tsx
{orderedSections.map((s, idx) => {
  const isActive = s.id === activeSection
  const isFirst = idx === 0
  const isConfirming = confirmRemoveId === s.id

  return (
    <div
      key={s.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        borderRadius: 6,
        background: isActive ? 'var(--ed-accent-surface)' : 'transparent',
        transition: 'background var(--dur-hover) var(--ease-out)',
      }}
      onMouseEnter={(e) => {
        if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--ed-bg)'
      }}
      onMouseLeave={(e) => {
        if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
      }}
      className="group"
    >
      <button
        className="ed-press"
        onClick={() => setActiveSection(s.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 10px',
          borderRadius: 6,
          background: 'transparent',
          color: isActive ? 'var(--ed-accent-text)' : 'var(--ed-secondary)',
          fontFamily: 'inherit',
          fontSize: 13,
          fontWeight: isActive ? 500 : 400,
          textAlign: 'left',
          cursor: 'pointer',
          flex: 1,
          minWidth: 0,
        }}
      >
        <span style={{ fontSize: 12, opacity: 0.75, lineHeight: 1, flexShrink: 0 }}>
          {BLOCK_ICONS[s.blockType] ?? '○'}
        </span>
        <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {s.label}
        </span>
      </button>
      {!isFirst && (
        isConfirming ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingRight: 6 }}>
            <button
              onClick={() => {
                removeSection(s.id)
                setConfirmRemoveId(null)
              }}
              className="ed-press"
              style={{
                fontSize: 11,
                color: 'oklch(55% 0.2 25)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 4px',
              }}
            >
              Rimuovi
            </button>
            <button
              onClick={() => setConfirmRemoveId(null)}
              className="ed-press"
              style={{
                fontSize: 11,
                color: 'var(--ed-muted)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 4px',
              }}
            >
              Annulla
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setConfirmRemoveId(s.id)
            }}
            aria-label={`Rimuovi sezione ${s.label}`}
            className="ed-press opacity-0 group-hover:opacity-100"
            style={{
              fontSize: 16,
              lineHeight: 1,
              color: 'var(--ed-muted)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              transition: 'opacity var(--dur-hover) var(--ease-out), color var(--dur-hover) var(--ease-out)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(55% 0.2 25)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ed-muted)' }}
          >
            ×
          </button>
        )
      )}
    </div>
  )
})}
```

Note Tailwind: `opacity-0 group-hover:opacity-100` richiede che il parent abbia la classe `group`. Già messa nello wrapper.

- [ ] **Step 2: Smoke test dev server**

Run: `npm run dev` (se non già aperto).
Apri `http://localhost:3000/editor/startup-launchpad`. Verifica:
- Hover su una sezione (non la prima) → `×` appare a destra
- La prima sezione non ha mai `×`
- Click su `×` → mostra "Rimuovi | Annulla"
- "Rimuovi" → sezione sparisce
- "Annulla" → torna allo stato `×`
- Undo (Ctrl/Cmd+Z se mappato, o pulsante undo se esiste) ripristina la sezione

- [ ] **Step 3: Commit**

```bash
git add components/editor/Sidebar.tsx
git commit -m "feat(sidebar): inline remove button with confirm per section"
```

---

### Task 16: Smoke test end-to-end + cleanup

**Files:**
- N/A (test manuale + check finale)

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: tutti PASS.

- [ ] **Step 2: Run type-check completo**

Run: `npx tsc --noEmit`
Expected: 0 errori.

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: 0 errori (warnings tollerabili se preesistenti).

- [ ] **Step 4: Build production**

Run: `npm run build`
Expected: build successful, nessun errore di compilazione.

- [ ] **Step 5: Test end-to-end manuale**

Apri `npm run dev` e nel browser:
1. Vai a `http://localhost:3000/editor/startup-launchpad`
2. Hover tra hero e features → vedi `+ Aggiungi sezione`
3. Click → modal apre con 8 card
4. Filtra per "Content" → vedi solo About e FAQ
5. Cerca "pricing" → vedi solo il preset Pricing
6. Click su "Hero · classico" → nuova sezione hero appare in posizione 2
7. Nuova sezione è automaticamente selezionata (form fields nel sidebar)
8. Hover sulla nuova sezione nel sidebar → `×` appare
9. Click `×` → conferma → "Rimuovi" → sezione sparisce
10. Cmd/Ctrl+Z (se mappato) o click undo → sezione ritorna
11. Aggiungi 3 sezioni in posizioni diverse → ordine corretto nel canvas e sidebar
12. Refresh pagina → tutte le sezioni e i values persistono
13. Test prima sezione (hero originale): hover → NO `×` mostrata
14. Cambia template (tornando a home → bistro): le tue sezioni custom su startup-launchpad restano salvate
15. Vai a `/preview/startup-launchpad` → tutte le sezioni custom appaiono nel preview

- [ ] **Step 6: Verifica payload localStorage**

DevTools → Application → Local Storage → `readylayout-startup-launchpad`. Verifica che il JSON contenga le chiavi: `values`, `sectionOrder`, `elementOrder`, `sections`.

- [ ] **Step 7: Cleanup file di debug temporanei**

Cerca smoke-test temporanei: 

Run: `git status`
Expected: nessun file untracked tipo `*.png` recente legato a debug (gli screenshot esistenti del progetto vanno bene).

- [ ] **Step 8: Commit finale + tag**

```bash
git add -A
git diff --cached  # verifica
git commit --allow-empty -m "chore: add/remove sections foundation complete (Plan 1)"
```

---

## Open follow-ups (Plan 2)

- Variant prop implementation sui block Hero/Features/About/CTA/Testimonials/FAQ/Pricing/Gallery/Stats/Articles/TextBlock/Contact
- Espandere `LAYOUT_PRESETS` da 8 a 35 sfruttando i variants
- UI per cambiare variant a sezione esistente (toggle nel sidebar)
- Template "blank" da zero
- Esporre `duplicateSection` con UI nel sidebar
- Static thumbnail caching per il picker (perf con catalog grandi)

---

## Self-review checklist

**Coperture spec → task:**

- Spec §"Goals: + inline tra sezioni" → Task 12 + 13 ✓
- Spec §"Goals: + nel sidebar" → Task 14 ✓
- Spec §"Goals: picker modale con 30+ layout" → Task 11 (modal) + Task 10 (8 preset; espansione a 35 → Plan 2) ✓ (parziale, documentato)
- Spec §"Goals: rimozione con conferma" → Task 15 ✓
- Spec §"Goals: persistenza/undo/export" → Task 3 ✓
- Spec §"Data model: variant?" → Task 1 ✓
- Spec §"Store: sections mutabile + addSection/removeSection/duplicateSection" → Task 3, 4, 5, 6 ✓
- Spec §"Migrazione storage" → Task 3 (loadFromStorage tollera assenza di sections) ✓
- Spec §"ID univoci" → Task 2 ✓
- Spec §"Regola hero non rimovibile" → Task 5 ✓
- Spec §"Variant system su blocks" → **deferred to Plan 2** (flag esplicito sopra) ✓
- Spec §"Preset count target 35" → **deferred to Plan 2** (target 8 in Plan 1) ✓

**Type consistency:** addSection signature `(presetId: string, insertAfterId: string | null) => void` usata coerentemente in store, TemplateRenderer, LayoutPicker, Sidebar. La sentinel `''` per "all'inizio" introdotta in Task 13 — applicata sia nel call site (TemplateRenderer) che nello store. Nome del file `lib/presets/layouts.ts` consistente in tutti i task.

**Placeholder scan:** Nessun "TBD/TODO/implement later" nei task. Ogni step di codice ha codice completo. Le decisioni di scope (variant system → Plan 2) sono esplicite, non placeholder.
