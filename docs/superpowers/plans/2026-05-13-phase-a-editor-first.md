# Phase A — Editor-First Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A working visual editor with the Startup Launchpad template, schema-driven sidebar panel, live canvas preview, and dev server running on localhost:3000.

**Architecture:** Schema-driven — the template schema defines sections and field types; Zustand store holds live values; Canvas renders the template from store; Sidebar renders inputs from schema. No database, no auth in Phase A.

**Tech Stack:** Next.js 15 App Router, TypeScript strict, Tailwind CSS v4, shadcn/ui, Zustand 5

---

## File Map

```
app/
  page.tsx                                  MODIFY  root redirect to /editor/demo
  layout.tsx                                MODIFY  root layout, fonts
  editor/[projectId]/page.tsx               CREATE  editor split layout page
  preview/[projectId]/page.tsx              CREATE  standalone preview page

components/
  templates/startup-launchpad/
    index.tsx                               CREATE  assembles all 5 sections
    Hero.tsx                                CREATE  hero section
    Features.tsx                            CREATE  features grid
    Pricing.tsx                             CREATE  pricing cards
    FAQ.tsx                                 CREATE  accordion FAQ
    CTA.tsx                                 CREATE  bottom CTA banner
  editor/
    EditorLayout.tsx                        CREATE  topbar + canvas/sidebar split
    Canvas.tsx                              CREATE  scrollable template preview
    Sidebar.tsx                             CREATE  section tabs + field list
    SectionNav.tsx                          CREATE  section tab navigation
    FieldRenderer.tsx                       CREATE  switches on field.type
    fields/
      TextField.tsx                         CREATE  input / textarea
      ColorField.tsx                        CREATE  color picker + hex input
      ImageField.tsx                        CREATE  URL input
      EmojiField.tsx                        CREATE  emoji text input
      RepeaterField.tsx                     CREATE  list with add/remove

lib/
  schemas/
    types.ts                                CREATE  TemplateSchema, Field, Section types
    startup-launchpad.ts                    CREATE  full schema definition
  store/
    editor.store.ts                         CREATE  Zustand editor store

__tests__/
  lib/schemas/types.test.ts                 CREATE  schema type guards
  lib/store/editor.store.test.ts            CREATE  store update logic
```

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: project root via `create-next-app`

- [ ] **Step 1: Scaffold the project**

```bash
cd /home/nicco/Code/site-generator
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --yes
```

Expected output: `Success! Created site-generator`

- [ ] **Step 2: Install Zustand and shadcn**

```bash
npm install zustand@^5
npx shadcn@latest init --yes --base-color slate
```

When prompted for style: select Default. When prompted for base color: slate. When asked about CSS variables: yes.

- [ ] **Step 3: Install shadcn components used in editor**

```bash
npx shadcn@latest add tabs separator button badge input label accordion
```

- [ ] **Step 4: Install test dependencies**

```bash
npm install -D jest @types/jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom ts-jest
```

- [ ] **Step 5: Configure Jest**

Create `jest.config.ts`:
```typescript
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }] },
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  setupFilesAfterFramework: ['@testing-library/jest-dom'],
}

export default config
```

Create `jest.setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

Update `jest.config.ts` to reference setup file:
```typescript
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }] },
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
}

export default config
```

Add to `package.json` scripts:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 6: Verify scaffold**

```bash
npm run dev &
curl -s http://localhost:3000 | head -5
```

Expected: HTML response (Next.js default page). Dev server stays running.

- [ ] **Step 7: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind, shadcn, Zustand, Jest"
```

---

## Task 2: Type System

**Files:**
- Create: `lib/schemas/types.ts`
- Create: `__tests__/lib/schemas/types.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/schemas/types.test.ts`:
```typescript
import type { TemplateSchema, Field, Section } from '@/lib/schemas/types'

describe('TemplateSchema types', () => {
  it('accepts a valid schema shape', () => {
    const schema: TemplateSchema = {
      id: 'test',
      name: 'Test Template',
      sections: [
        {
          id: 'hero',
          label: 'Hero',
          fields: [
            { id: 'headline', type: 'text', label: 'Headline', default: 'Hello', multiline: false },
            { id: 'bg', type: 'color', label: 'Background', default: '#000000' },
          ],
        },
      ],
    }
    expect(schema.id).toBe('test')
    expect(schema.sections[0].fields).toHaveLength(2)
  })

  it('accepts a repeater field with itemSchema', () => {
    const field: Field = {
      id: 'items',
      type: 'repeater',
      label: 'Items',
      default: [],
      itemSchema: [
        { id: 'title', type: 'text', label: 'Title', default: '' },
      ],
    }
    expect(field.type).toBe('repeater')
  })
})
```

- [ ] **Step 2: Run test — expect failure (module not found)**

```bash
npx jest __tests__/lib/schemas/types.test.ts --no-coverage
```

Expected: `Cannot find module '@/lib/schemas/types'`

- [ ] **Step 3: Create the type system**

Create `lib/schemas/types.ts`:
```typescript
export type FieldType = 'text' | 'color' | 'image' | 'emoji' | 'repeater'

export interface TextField {
  id: string
  type: 'text'
  label: string
  default: string
  multiline?: boolean
}

export interface ColorField {
  id: string
  type: 'color'
  label: string
  default: string
}

export interface ImageField {
  id: string
  type: 'image'
  label: string
  default: string
}

export interface EmojiField {
  id: string
  type: 'emoji'
  label: string
  default: string
}

export interface RepeaterItemField {
  id: string
  type: Exclude<FieldType, 'repeater'>
  label: string
  default: string
}

export interface RepeaterField {
  id: string
  type: 'repeater'
  label: string
  default: Record<string, string>[]
  itemSchema: RepeaterItemField[]
}

export type Field = TextField | ColorField | ImageField | EmojiField | RepeaterField

export interface Section {
  id: string
  label: string
  fields: Field[]
}

export interface TemplateSchema {
  id: string
  name: string
  sections: Section[]
}

export type TemplateValues = Record<string, Record<string, unknown>>
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx jest __tests__/lib/schemas/types.test.ts --no-coverage
```

Expected: `PASS __tests__/lib/schemas/types.test.ts`

- [ ] **Step 5: Commit**

```bash
git add lib/schemas/types.ts __tests__/lib/schemas/types.test.ts
git commit -m "feat: add template schema type system"
```

---

## Task 3: Startup Launchpad Schema

**Files:**
- Create: `lib/schemas/startup-launchpad.ts`

- [ ] **Step 1: Create the schema**

Create `lib/schemas/startup-launchpad.ts`:
```typescript
import type { TemplateSchema } from './types'

export const startupLaunchpadSchema: TemplateSchema = {
  id: 'startup-launchpad',
  name: 'Startup Launchpad',
  sections: [
    {
      id: 'hero',
      label: 'Hero',
      fields: [
        { id: 'headline',    type: 'text',  label: 'Titolo principale', default: 'Il tuo prodotto\ncambia tutto.' },
        { id: 'subheadline', type: 'text',  label: 'Sottotitolo',       default: 'Costruito per team moderni. Veloce, semplice, potente.', multiline: true },
        { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA',         default: 'Inizia gratis →' },
        { id: 'bgColor',     type: 'color', label: 'Sfondo',            default: '#0f172a' },
        { id: 'textColor',   type: 'color', label: 'Testo',             default: '#f8fafc' },
        { id: 'accentColor', type: 'color', label: 'Colore accento',    default: '#6366f1' },
      ],
    },
    {
      id: 'features',
      label: 'Features',
      fields: [
        { id: 'sectionTitle', type: 'text',  label: 'Titolo sezione',  default: 'Tutto quello che ti serve' },
        { id: 'accentColor',  type: 'color', label: 'Colore accento',  default: '#6366f1' },
        {
          id: 'items',
          type: 'repeater',
          label: 'Feature items',
          default: [
            { icon: '⚡', title: 'Ultrarapido',       desc: 'Carica in meno di un secondo ovunque.' },
            { icon: '🔒', title: 'Sicuro by default', desc: 'Crittografia end-to-end senza configurazioni.' },
            { icon: '🎨', title: 'Personalizzabile',  desc: 'Adattalo al tuo brand in pochi click.' },
          ],
          itemSchema: [
            { id: 'icon',  type: 'emoji', label: 'Icona',        default: '✨' },
            { id: 'title', type: 'text',  label: 'Titolo',       default: 'Feature' },
            { id: 'desc',  type: 'text',  label: 'Descrizione',  default: 'Descrizione della feature.' },
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Pricing',
      fields: [
        { id: 'sectionTitle', type: 'text',  label: 'Titolo sezione', default: 'Piani semplici, nessuna sorpresa' },
        { id: 'accentColor',  type: 'color', label: 'Colore accento', default: '#6366f1' },
        {
          id: 'plans',
          type: 'repeater',
          label: 'Piani',
          default: [
            { name: 'Starter', price: '0',  period: '/mese', cta: 'Inizia gratis',   highlighted: 'false', features: 'Fino a 3 progetti|10 GB storage|Supporto community' },
            { name: 'Pro',     price: '29', period: '/mese', cta: 'Prova 14 giorni', highlighted: 'true',  features: 'Progetti illimitati|100 GB storage|Supporto prioritario|Analytics avanzate' },
            { name: 'Team',    price: '79', period: '/mese', cta: 'Contattaci',       highlighted: 'false', features: 'Tutto di Pro|Team illimitati|SSO|SLA garantito' },
          ],
          itemSchema: [
            { id: 'name',        type: 'text',  label: 'Nome piano',   default: 'Piano' },
            { id: 'price',       type: 'text',  label: 'Prezzo (€)',    default: '0' },
            { id: 'period',      type: 'text',  label: 'Periodo',       default: '/mese' },
            { id: 'cta',         type: 'text',  label: 'Testo bottone', default: 'Scegli' },
            { id: 'highlighted', type: 'text',  label: 'In evidenza (true/false)', default: 'false' },
            { id: 'features',    type: 'text',  label: 'Feature (separare con |)',  default: 'Feature 1|Feature 2' },
          ],
        },
      ],
    },
    {
      id: 'faq',
      label: 'FAQ',
      fields: [
        { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Domande frequenti' },
        {
          id: 'items',
          type: 'repeater',
          label: 'Domande',
          default: [
            { question: 'Posso cancellare in qualsiasi momento?',        answer: 'Sì, puoi cancellare il tuo piano in qualsiasi momento senza penali.' },
            { question: 'È disponibile una versione di prova?',           answer: 'Offriamo 14 giorni di prova gratuita su tutti i piani a pagamento.' },
            { question: 'Supportate l\'integrazione con altri strumenti?', answer: 'Sì, offriamo oltre 50 integrazioni native con i principali strumenti.' },
          ],
          itemSchema: [
            { id: 'question', type: 'text', label: 'Domanda', default: 'La tua domanda?' },
            { id: 'answer',   type: 'text', label: 'Risposta', default: 'La risposta qui.' },
          ],
        },
      ],
    },
    {
      id: 'cta',
      label: 'CTA Finale',
      fields: [
        { id: 'headline',   type: 'text',  label: 'Titolo',       default: 'Pronto a iniziare?' },
        { id: 'subtext',    type: 'text',  label: 'Testo',        default: 'Unisciti a oltre 10.000 team che usano il nostro prodotto ogni giorno.' },
        { id: 'ctaLabel',   type: 'text',  label: 'Testo bottone', default: 'Inizia gratis — è semplice' },
        { id: 'bgColor',    type: 'color', label: 'Sfondo',       default: '#6366f1' },
        { id: 'textColor',  type: 'color', label: 'Testo',        default: '#ffffff' },
      ],
    },
  ],
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add lib/schemas/startup-launchpad.ts
git commit -m "feat: add Startup Launchpad template schema"
```

---

## Task 4: Zustand Editor Store

**Files:**
- Create: `lib/store/editor.store.ts`
- Create: `__tests__/lib/store/editor.store.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lib/store/editor.store.test.ts`:
```typescript
import { createEditorStore } from '@/lib/store/editor.store'
import { startupLaunchpadSchema } from '@/lib/schemas/startup-launchpad'

describe('editor store', () => {
  it('initializes values from schema defaults', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const state = store.getState()
    expect(state.values['hero']['headline']).toBe('Il tuo prodotto\ncambia tutto.')
    expect(state.values['hero']['bgColor']).toBe('#0f172a')
  })

  it('updates a field value', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().updateField('hero', 'headline', 'New headline')
    expect(store.getState().values['hero']['headline']).toBe('New headline')
  })

  it('resets values to defaults', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().updateField('hero', 'headline', 'Changed')
    store.getState().reset()
    expect(store.getState().values['hero']['headline']).toBe('Il tuo prodotto\ncambia tutto.')
  })

  it('sets active section', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().setActiveSection('features')
    expect(store.getState().activeSection).toBe('features')
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx jest __tests__/lib/store/editor.store.test.ts --no-coverage
```

Expected: `Cannot find module '@/lib/store/editor.store'`

- [ ] **Step 3: Implement the store**

Create `lib/store/editor.store.ts`:
```typescript
import { createStore } from 'zustand/vanilla'
import type { TemplateSchema, TemplateValues } from '@/lib/schemas/types'

function buildDefaults(schema: TemplateSchema): TemplateValues {
  return Object.fromEntries(
    schema.sections.map((section) => [
      section.id,
      Object.fromEntries(section.fields.map((field) => [field.id, field.default])),
    ])
  )
}

export interface EditorState {
  templateId: string
  schema: TemplateSchema
  values: TemplateValues
  activeSection: string
  updateField: (sectionId: string, fieldId: string, value: unknown) => void
  setActiveSection: (sectionId: string) => void
  reset: () => void
}

export function createEditorStore(schema: TemplateSchema) {
  const defaults = buildDefaults(schema)
  return createStore<EditorState>()((set) => ({
    templateId: schema.id,
    schema,
    values: structuredClone(defaults),
    activeSection: schema.sections[0]?.id ?? '',
    updateField: (sectionId, fieldId, value) =>
      set((state) => ({
        values: {
          ...state.values,
          [sectionId]: { ...state.values[sectionId], [fieldId]: value },
        },
      })),
    setActiveSection: (sectionId) => set({ activeSection: sectionId }),
    reset: () => set({ values: structuredClone(defaults) }),
  }))
}

export type EditorStore = ReturnType<typeof createEditorStore>
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npx jest __tests__/lib/store/editor.store.test.ts --no-coverage
```

Expected: `PASS __tests__/lib/store/editor.store.test.ts` (4 tests passing)

- [ ] **Step 5: Create React context for the store**

Create `lib/store/editor-context.tsx`:
```typescript
'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createEditorStore, type EditorStore, type EditorState } from './editor.store'
import { startupLaunchpadSchema } from '@/lib/schemas/startup-launchpad'

const EditorContext = createContext<EditorStore | null>(null)

export function EditorProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<EditorStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createEditorStore(startupLaunchpadSchema)
  }
  return (
    <EditorContext.Provider value={storeRef.current}>
      {children}
    </EditorContext.Provider>
  )
}

export function useEditorStore<T>(selector: (state: EditorState) => T): T {
  const store = useContext(EditorContext)
  if (!store) throw new Error('useEditorStore must be used within EditorProvider')
  return useStore(store, selector)
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/store/ __tests__/lib/store/
git commit -m "feat: add Zustand editor store with React context provider"
```

---

## Task 5: Template Section Components

**Files:**
- Create: `components/templates/startup-launchpad/Hero.tsx`
- Create: `components/templates/startup-launchpad/Features.tsx`
- Create: `components/templates/startup-launchpad/Pricing.tsx`
- Create: `components/templates/startup-launchpad/FAQ.tsx`
- Create: `components/templates/startup-launchpad/CTA.tsx`
- Create: `components/templates/startup-launchpad/index.tsx`

- [ ] **Step 1: Create Hero component**

Create `components/templates/startup-launchpad/Hero.tsx`:
```tsx
interface HeroProps {
  headline: string
  subheadline: string
  ctaLabel: string
  bgColor: string
  textColor: string
  accentColor: string
}

export function Hero({ headline, subheadline, ctaLabel, bgColor, textColor, accentColor }: HeroProps) {
  return (
    <section style={{ backgroundColor: bgColor, color: textColor }} className="min-h-[90vh] flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="max-w-3xl">
          <div
            className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6"
            style={{ backgroundColor: accentColor + '22', color: accentColor }}
          >
            Nuovo ✦ Appena lanciato
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-6 whitespace-pre-line">
            {headline}
          </h1>
          <p className="text-xl opacity-70 leading-relaxed mb-10 max-w-xl">
            {subheadline}
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              className="px-8 py-4 rounded-full font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: accentColor, color: '#fff' }}
            >
              {ctaLabel}
            </button>
            <span className="text-sm opacity-50">Nessuna carta di credito richiesta</span>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create Features component**

Create `components/templates/startup-launchpad/Features.tsx`:
```tsx
interface FeatureItem {
  icon: string
  title: string
  desc: string
}

interface FeaturesProps {
  sectionTitle: string
  accentColor: string
  items: FeatureItem[]
}

export function Features({ sectionTitle, accentColor, items }: FeaturesProps) {
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-slate-900 text-center mb-4">{sectionTitle}</h2>
        <p className="text-center text-slate-500 mb-16">
          Progettato per chi non vuole compromessi.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6"
                style={{ backgroundColor: accentColor + '15' }}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create Pricing component**

Create `components/templates/startup-launchpad/Pricing.tsx`:
```tsx
interface Plan {
  name: string
  price: string
  period: string
  cta: string
  highlighted: string
  features: string
}

interface PricingProps {
  sectionTitle: string
  accentColor: string
  plans: Plan[]
}

export function Pricing({ sectionTitle, accentColor, plans }: PricingProps) {
  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-slate-900 text-center mb-4">{sectionTitle}</h2>
        <p className="text-center text-slate-500 mb-16">Scala quando sei pronto.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => {
            const isHighlighted = plan.highlighted === 'true'
            const features = plan.features.split('|').filter(Boolean)
            return (
              <div
                key={i}
                className={`rounded-2xl p-8 flex flex-col ${
                  isHighlighted
                    ? 'text-white shadow-xl scale-[1.03]'
                    : 'bg-white border border-slate-200'
                }`}
                style={isHighlighted ? { backgroundColor: accentColor } : {}}
              >
                <div className="mb-6">
                  <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${isHighlighted ? 'opacity-80' : 'text-slate-500'}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">€{plan.price}</span>
                    <span className={`text-sm ${isHighlighted ? 'opacity-70' : 'text-slate-400'}`}>{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <span className={isHighlighted ? 'opacity-80' : 'text-slate-400'}>✓</span>
                      <span className={isHighlighted ? '' : 'text-slate-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 ${
                    isHighlighted ? 'bg-white' : 'border border-current'
                  }`}
                  style={isHighlighted ? { color: accentColor } : { color: accentColor }}
                >
                  {plan.cta}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create FAQ component**

Create `components/templates/startup-launchpad/FAQ.tsx`:
```tsx
'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  sectionTitle: string
  items: FAQItem[]
}

export function FAQ({ sectionTitle, items }: FAQProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-white py-24">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">{sectionTitle}</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-slate-900">{item.question}</span>
                <span className="text-slate-400 ml-4 shrink-0">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create CTA component**

Create `components/templates/startup-launchpad/CTA.tsx`:
```tsx
interface CTAProps {
  headline: string
  subtext: string
  ctaLabel: string
  bgColor: string
  textColor: string
}

export function CTA({ headline, subtext, ctaLabel, bgColor, textColor }: CTAProps) {
  return (
    <section style={{ backgroundColor: bgColor, color: textColor }} className="py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold mb-4 leading-tight">{headline}</h2>
        <p className="text-lg opacity-75 mb-10 max-w-xl mx-auto">{subtext}</p>
        <button
          className="px-10 py-4 rounded-full font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: textColor, color: bgColor }}
        >
          {ctaLabel}
        </button>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create template index (composition)**

Create `components/templates/startup-launchpad/index.tsx`:
```tsx
import { Hero } from './Hero'
import { Features } from './Features'
import { Pricing } from './Pricing'
import { FAQ } from './FAQ'
import { CTA } from './CTA'
import type { TemplateValues } from '@/lib/schemas/types'

interface StartupLaunchpadProps {
  values: TemplateValues
}

export function StartupLaunchpad({ values }: StartupLaunchpadProps) {
  const hero     = values['hero']     as Record<string, string>
  const features = values['features'] as Record<string, unknown>
  const pricing  = values['pricing']  as Record<string, unknown>
  const faq      = values['faq']      as Record<string, unknown>
  const cta      = values['cta']      as Record<string, string>

  return (
    <div className="font-sans">
      <Hero
        headline={hero['headline'] as string}
        subheadline={hero['subheadline'] as string}
        ctaLabel={hero['ctaLabel'] as string}
        bgColor={hero['bgColor'] as string}
        textColor={hero['textColor'] as string}
        accentColor={hero['accentColor'] as string}
      />
      <Features
        sectionTitle={features['sectionTitle'] as string}
        accentColor={features['accentColor'] as string}
        items={features['items'] as { icon: string; title: string; desc: string }[]}
      />
      <Pricing
        sectionTitle={pricing['sectionTitle'] as string}
        accentColor={pricing['accentColor'] as string}
        plans={pricing['plans'] as { name: string; price: string; period: string; cta: string; highlighted: string; features: string }[]}
      />
      <FAQ
        sectionTitle={faq['sectionTitle'] as string}
        items={faq['items'] as { question: string; answer: string }[]}
      />
      <CTA
        headline={cta['headline'] as string}
        subtext={cta['subtext'] as string}
        ctaLabel={cta['ctaLabel'] as string}
        bgColor={cta['bgColor'] as string}
        textColor={cta['textColor'] as string}
      />
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add components/templates/
git commit -m "feat: add Startup Launchpad template components (Hero, Features, Pricing, FAQ, CTA)"
```

---

## Task 6: Field Components

**Files:**
- Create: `components/editor/fields/TextField.tsx`
- Create: `components/editor/fields/ColorField.tsx`
- Create: `components/editor/fields/ImageField.tsx`
- Create: `components/editor/fields/EmojiField.tsx`
- Create: `components/editor/fields/RepeaterField.tsx`
- Create: `components/editor/FieldRenderer.tsx`

- [ ] **Step 1: Create TextField**

Create `components/editor/fields/TextField.tsx`:
```tsx
'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface TextFieldProps {
  id: string
  label: string
  value: string
  multiline?: boolean
  onChange: (value: string) => void
}

export function TextField({ id, label, value, multiline, onChange }: TextFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-slate-500 uppercase tracking-wide">{label}</Label>
      {multiline ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="resize-none text-sm"
        />
      ) : (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-sm"
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create ColorField**

Create `components/editor/fields/ColorField.tsx`:
```tsx
'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ColorFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorField({ id, label, value, onChange }: ColorFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-slate-500 uppercase tracking-wide">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 rounded cursor-pointer border border-slate-200 p-0.5"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-sm font-mono"
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create ImageField**

Create `components/editor/fields/ImageField.tsx`:
```tsx
'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ImageFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

export function ImageField({ id, label, value, onChange }: ImageFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-slate-500 uppercase tracking-wide">{label}</Label>
      {value && (
        <img src={value} alt="preview" className="w-full h-24 object-cover rounded-lg border border-slate-200" />
      )}
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://... o /path/to/image.png"
        className="text-sm"
      />
    </div>
  )
}
```

- [ ] **Step 4: Create EmojiField**

Create `components/editor/fields/EmojiField.tsx`:
```tsx
'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface EmojiFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

export function EmojiField({ id, label, value, onChange }: EmojiFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-slate-500 uppercase tracking-wide">{label}</Label>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{value}</span>
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 text-center text-lg"
          maxLength={2}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create RepeaterField**

Create `components/editor/fields/RepeaterField.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { RepeaterItemField } from '@/lib/schemas/types'
import { FieldRenderer } from '../FieldRenderer'

interface RepeaterFieldProps {
  id: string
  label: string
  value: Record<string, string>[]
  itemSchema: RepeaterItemField[]
  onChange: (value: Record<string, string>[]) => void
}

export function RepeaterField({ id, label, value, itemSchema, onChange }: RepeaterFieldProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function updateItem(index: number, fieldId: string, fieldValue: string) {
    const next = value.map((item, i) =>
      i === index ? { ...item, [fieldId]: fieldValue } : item
    )
    onChange(next)
  }

  function addItem() {
    const newItem = Object.fromEntries(itemSchema.map((f) => [f.id, f.default]))
    onChange([...value, newItem])
    setOpenIndex(value.length)
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index))
    if (openIndex === index) setOpenIndex(null)
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs text-slate-500 uppercase tracking-wide">{label}</Label>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-left hover:bg-slate-50 transition-colors"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="font-medium text-slate-700">
                {item['icon'] || item['title'] || item['name'] || item['question'] || `Item ${i + 1}`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(i) }}
                  className="text-slate-400 hover:text-red-500 transition-colors px-1"
                >
                  ×
                </button>
                <span className="text-slate-400">{openIndex === i ? '▲' : '▼'}</span>
              </div>
            </button>
            {openIndex === i && (
              <div className="px-3 pb-3 space-y-3 border-t border-slate-100 pt-3">
                {itemSchema.map((subField) => (
                  <FieldRenderer
                    key={subField.id}
                    field={subField as any}
                    value={item[subField.id] ?? subField.default}
                    onChange={(val) => updateItem(i, subField.id, val as string)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={addItem} className="w-full text-xs">
        + Aggiungi {label.toLowerCase()}
      </Button>
    </div>
  )
}
```

- [ ] **Step 6: Create FieldRenderer**

Create `components/editor/FieldRenderer.tsx`:
```tsx
'use client'

import type { Field } from '@/lib/schemas/types'
import { TextField } from './fields/TextField'
import { ColorField } from './fields/ColorField'
import { ImageField } from './fields/ImageField'
import { EmojiField } from './fields/EmojiField'
import { RepeaterField } from './fields/RepeaterField'

interface FieldRendererProps {
  field: Field
  value: unknown
  onChange: (value: unknown) => void
}

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  switch (field.type) {
    case 'text':
      return (
        <TextField
          id={field.id}
          label={field.label}
          value={value as string}
          multiline={field.multiline}
          onChange={onChange}
        />
      )
    case 'color':
      return (
        <ColorField
          id={field.id}
          label={field.label}
          value={value as string}
          onChange={onChange}
        />
      )
    case 'image':
      return (
        <ImageField
          id={field.id}
          label={field.label}
          value={value as string}
          onChange={onChange}
        />
      )
    case 'emoji':
      return (
        <EmojiField
          id={field.id}
          label={field.label}
          value={value as string}
          onChange={onChange}
        />
      )
    case 'repeater':
      return (
        <RepeaterField
          id={field.id}
          label={field.label}
          value={value as Record<string, string>[]}
          itemSchema={field.itemSchema}
          onChange={onChange}
        />
      )
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add components/editor/
git commit -m "feat: add editor field components and FieldRenderer"
```

---

## Task 7: Editor UI Assembly

**Files:**
- Create: `components/editor/SectionNav.tsx`
- Create: `components/editor/Sidebar.tsx`
- Create: `components/editor/Canvas.tsx`
- Create: `components/editor/EditorLayout.tsx`

- [ ] **Step 1: Create SectionNav**

Create `components/editor/SectionNav.tsx`:
```tsx
'use client'

import { useEditorStore } from '@/lib/store/editor-context'

export function SectionNav() {
  const sections = useEditorStore((s) => s.schema.sections)
  const activeSection = useEditorStore((s) => s.activeSection)
  const setActiveSection = useEditorStore((s) => s.setActiveSection)

  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-lg flex-wrap">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeSection === section.id
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {section.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create Sidebar**

Create `components/editor/Sidebar.tsx`:
```tsx
'use client'

import { useEditorStore } from '@/lib/store/editor-context'
import { SectionNav } from './SectionNav'
import { FieldRenderer } from './FieldRenderer'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  const schema = useEditorStore((s) => s.schema)
  const values = useEditorStore((s) => s.values)
  const activeSection = useEditorStore((s) => s.activeSection)
  const updateField = useEditorStore((s) => s.updateField)
  const reset = useEditorStore((s) => s.reset)

  const section = schema.sections.find((s) => s.id === activeSection)

  return (
    <div className="w-[400px] shrink-0 border-l border-slate-200 bg-white flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Personalizza</h2>
          <Button variant="ghost" size="sm" onClick={reset} className="text-xs text-slate-400">
            Reset
          </Button>
        </div>
        <SectionNav />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {section?.fields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={values[activeSection]?.[field.id] ?? field.default}
            onChange={(val) => updateField(activeSection, field.id, val)}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create Canvas**

Create `components/editor/Canvas.tsx`:
```tsx
'use client'

import { useEditorStore } from '@/lib/store/editor-context'
import { StartupLaunchpad } from '@/components/templates/startup-launchpad'

export function Canvas() {
  const values = useEditorStore((s) => s.values)

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100">
      <div className="min-h-full bg-white shadow-sm">
        <StartupLaunchpad values={values} />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create EditorLayout**

Create `components/editor/EditorLayout.tsx`:
```tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Canvas } from './Canvas'
import { Sidebar } from './Sidebar'

export function EditorLayout() {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Topbar */}
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-sm font-semibold text-slate-800">Startup Launchpad</span>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">draft</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/preview/demo" target="_blank">
            <Button variant="outline" size="sm" className="text-xs">
              Preview ↗
            </Button>
          </Link>
          <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700">
            Pubblica
          </Button>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        <Canvas />
        <Sidebar />
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/editor/
git commit -m "feat: add editor UI (SectionNav, Sidebar, Canvas, EditorLayout)"
```

---

## Task 8: Pages and Routes

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Create: `app/editor/[projectId]/page.tsx`
- Create: `app/preview/[projectId]/page.tsx`

- [ ] **Step 1: Update root layout**

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'SiteGen — Crea il tuo sito',
  description: 'Piattaforma No-Code per creare siti web professionali.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Update root page (redirect)**

Replace `app/page.tsx`:
```tsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/editor/demo')
}
```

- [ ] **Step 3: Create editor page**

Create `app/editor/[projectId]/page.tsx`:
```tsx
import { EditorProvider } from '@/lib/store/editor-context'
import { EditorLayout } from '@/components/editor/EditorLayout'

export default function EditorPage() {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  )
}
```

- [ ] **Step 4: Create preview page**

Create `app/preview/[projectId]/page.tsx`:
```tsx
import { startupLaunchpadSchema } from '@/lib/schemas/startup-launchpad'
import { StartupLaunchpad } from '@/components/templates/startup-launchpad'

function buildDefaults() {
  return Object.fromEntries(
    startupLaunchpadSchema.sections.map((s) => [
      s.id,
      Object.fromEntries(s.fields.map((f) => [f.id, f.default])),
    ])
  )
}

export default function PreviewPage() {
  const values = buildDefaults()
  return (
    <div className="font-sans">
      <StartupLaunchpad values={values} />
    </div>
  )
}
```

Note: Preview page uses schema defaults (server-rendered). In Phase B this will read from Supabase. For now it shows the default template.

- [ ] **Step 5: Commit**

```bash
git add app/
git commit -m "feat: add editor page, preview page, root redirect"
```

---

## Task 9: Run Dev Server and Verify

- [ ] **Step 1: Run full test suite**

```bash
npx jest --no-coverage
```

Expected: all tests passing (types + store)

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Start dev server**

```bash
npm run dev
```

Expected: `▲ Next.js 15.x.x` → `Local: http://localhost:3000`

- [ ] **Step 4: Verify success criteria**

Open browser to `http://localhost:3000` and verify each criterion:

1. ✅ Root `/` redirects to `/editor/demo`
2. ✅ Split layout visible: canvas left, sidebar right, topbar
3. ✅ Edit headline in sidebar → canvas updates in real time
4. ✅ Edit bgColor → hero background changes instantly
5. ✅ Features repeater: add/remove items works
6. ✅ Pricing repeater: add/remove items works
7. ✅ FAQ repeater: add/remove items works
8. ✅ Click "Preview ↗" → opens `/preview/demo` in new tab with clean site
9. ✅ Preview site is responsive on mobile viewport

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: Phase A complete — Startup Launchpad editor with live sidebar preview"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Schema-driven editor → Task 2, 3
- [x] Zustand store with React context → Task 4
- [x] All 5 template sections (Hero, Features, Pricing, FAQ, CTA) → Task 5
- [x] All field types (text, color, image, emoji, repeater) → Task 6
- [x] Sidebar panel UI → Task 7
- [x] Canvas live preview → Task 7
- [x] Section nav tabs → Task 7
- [x] Editor page route `/editor/[projectId]` → Task 8
- [x] Preview page route `/preview/[projectId]` → Task 8
- [x] Root redirect → Task 8
- [x] Dev server verification → Task 9

**Type consistency:**
- `createEditorStore` in Task 4 → used via `EditorProvider` in Task 4 step 5 → referenced in Task 8. Consistent.
- `useEditorStore` hook defined in `editor-context.tsx` Task 4 → used in SectionNav, Sidebar, Canvas Task 7. Consistent.
- `TemplateValues` defined in `types.ts` Task 2 → used in store Task 4 and template index Task 5. Consistent.
- `startupLaunchpadSchema` defined in Task 3 → used in EditorProvider Task 4 and PreviewPage Task 8. Consistent.

**No placeholders found.** All steps have complete code.
