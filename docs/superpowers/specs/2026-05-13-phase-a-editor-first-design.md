# Phase A — Editor-First Design Spec

**Date:** 2026-05-13  
**Scope:** Phase A of a No-Code/Low-Code SaaS website builder  
**Goal:** A working visual editor with one template (Startup Launchpad), schema-driven sidebar panel, live canvas preview, and dev server running continuously.

---

## 1. Architecture Overview

**Approach:** Schema-driven editor. Each template exports a static JSON schema describing its sections and editable fields. The editor reads the schema, renders inputs in a sidebar, and reflects changes instantly on a live canvas.

**Data flow:**
```
Schema (static) → initialize Zustand store → Canvas renders from store values
                                           → Sidebar reads store, renders inputs
                                           → User edits input → updateField() → store updates → Canvas re-renders
```

**Technology stack:**
- Next.js 15 App Router, TypeScript strict mode
- Tailwind CSS v4
- shadcn/ui (components: Input, Slider, Tabs, Separator, Button, Badge)
- Zustand (editor state)
- No database in Phase A — state is in-memory only

---

## 2. Directory Structure

```
/app
  /editor/[projectId]/
    page.tsx              → EditorPage: wraps Canvas + Sidebar in split layout
  /preview/[projectId]/
    page.tsx              → Standalone preview (iframe-friendly, no editor chrome)
  layout.tsx              → Root layout (no ClerkProvider yet — Phase B)
  page.tsx                → Landing redirect → /editor/demo

/components
  /templates
    /startup-launchpad/
      index.tsx           → Assembles all sections into a full page
      Hero.tsx            → Hero section component
      Features.tsx        → Features grid section
      Pricing.tsx         → Pricing cards section
      FAQ.tsx             → Accordion FAQ section
      CTA.tsx             → Bottom call-to-action section
  /editor
    EditorLayout.tsx      → Split layout: canvas 60% | sidebar 40%
    Canvas.tsx            → Renders the template inside a scrollable iframe-like container
    Sidebar.tsx           → Section nav tabs + FieldRenderer list
    FieldRenderer.tsx     → Switches on field type → renders correct input
    SectionNav.tsx        → Tabs to switch active section in sidebar
    fields/
      TextField.tsx       → Input / Textarea
      ColorField.tsx      → Native color picker + hex input
      ImageField.tsx      → URL input + file upload button
      EmojiField.tsx      → Text input for emoji character
      RepeaterField.tsx   → List of sub-items with add/remove

/lib
  /schemas
    types.ts              → TemplateSchema, Section, Field, FieldType types
    startup-launchpad.ts  → Full schema for the Startup Launchpad template
  /store
    editor.store.ts       → Zustand store: values, activeSection, updateField, reset

/public
  /placeholders/
    hero.png              → Default placeholder hero image
```

---

## 3. Schema Type System

```typescript
// lib/schemas/types.ts

export type FieldType = 'text' | 'color' | 'image' | 'emoji' | 'repeater'

export interface BaseField {
  id: string
  label: string
  type: FieldType
  default: unknown
}

export interface TextField extends BaseField {
  type: 'text'
  default: string
  multiline?: boolean
}

export interface ColorField extends BaseField {
  type: 'color'
  default: string // hex
}

export interface ImageField extends BaseField {
  type: 'image'
  default: string // URL or path
}

export interface EmojiField extends BaseField {
  type: 'emoji'
  default: string
}

export interface RepeaterField extends BaseField {
  type: 'repeater'
  default: Record<string, unknown>[]
  itemSchema: Omit<BaseField, 'type'>[] & { type: Exclude<FieldType, 'repeater'> }[]
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
```

---

## 4. Startup Launchpad Schema

Five sections, each with typed fields:

| Section | Fields |
|---|---|
| **Hero** | headline (text), subheadline (text), ctaLabel (text), bgColor (color), textColor (color), image (image) |
| **Features** | sectionTitle (text), accentColor (color), items (repeater: icon, title, desc) |
| **Pricing** | sectionTitle (text), plans (repeater: name, price, period, features[], ctaLabel, highlighted) |
| **FAQ** | sectionTitle (text), items (repeater: question, answer) |
| **CTA** | headline (text), subtext (text), ctaLabel (text), bgColor (color), textColor (color) |

---

## 5. Zustand Store

```typescript
// lib/store/editor.store.ts

interface EditorState {
  templateId: string
  schema: TemplateSchema
  values: Record<string, Record<string, unknown>>  // [sectionId][fieldId] = value
  activeSection: string

  updateField: (sectionId: string, fieldId: string, value: unknown) => void
  setActiveSection: (sectionId: string) => void
  reset: () => void
}
```

Initialization: store is hydrated from schema `default` values on mount. `updateField` produces a new object (immutable update) so Canvas re-renders correctly.

---

## 6. Editor UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  TOPBAR: [🎨 Startup Launchpad]              [Preview] [Export] │
├──────────────────────────────┬──────────────────────────────────┤
│                              │  SIDEBAR                         │
│                              │  ┌──────────────────────────┐   │
│         CANVAS               │  │ Hero │ Features │ Pricing │   │
│   (live template preview,    │  │ FAQ  │ CTA               │   │
│    scrollable, 60% width)    │  └──────────────────────────┘   │
│                              │                                  │
│                              │  [Field inputs for active        │
│                              │   section rendered here]         │
│                              │                                  │
└──────────────────────────────┴──────────────────────────────────┘
```

- Canvas: `flex-1 overflow-y-auto`, renders `<StartupLaunchpad values={values} />` directly (no iframe in Phase A for simplicity)
- Sidebar: `w-[400px] shrink-0`, section tabs at top, scrollable field list below
- Topbar: template name + two action buttons (Preview opens `/preview/demo` in new tab, Export is placeholder)

---

## 7. Template Component Contract

Each section component receives only its slice of values:

```typescript
// components/templates/startup-launchpad/Hero.tsx
interface HeroProps {
  headline: string
  subheadline: string
  ctaLabel: string
  bgColor: string
  textColor: string
  image: string
}

export function Hero(props: HeroProps) { ... }
```

`StartupLaunchpad/index.tsx` maps store values to section props and composes all five sections. This keeps template components pure and testable — they know nothing about the editor.

---

## 8. Field Renderer Logic

```typescript
// components/editor/FieldRenderer.tsx
function FieldRenderer({ field, value, onChange }) {
  switch (field.type) {
    case 'text':    return <TextField ... />
    case 'color':   return <ColorField ... />
    case 'image':   return <ImageField ... />
    case 'emoji':   return <EmojiField ... />
    case 'repeater': return <RepeaterField ... />
  }
}
```

`RepeaterField` renders a list of collapsed items. Each item expands inline to show its sub-fields (using the same `FieldRenderer` recursively, depth-limited to 1).

---

## 9. Routing

| Route | Purpose |
|---|---|
| `/` | Redirects to `/editor/demo` |
| `/editor/[projectId]` | Main editor page (Phase A: projectId is always `demo`) |
| `/preview/[projectId]` | Clean preview without editor chrome |

In Phase B, `projectId` will map to a real Supabase row. In Phase A it is a static string used only as a URL slug.

---

## 10. What's Explicitly Out of Scope for Phase A

- Authentication (Phase B — Clerk)
- Database persistence (Phase B/C — Supabase)
- Multiple templates (Phase A validates the system with one)
- Export/publish (placeholder button only)
- AI copywriter (Phase C+)
- Drag-and-drop section reordering (Phase C+)
- Mobile responsive editor UI (the editor itself; the generated site IS responsive)

---

## 11. Success Criteria

Phase A is complete when:
1. `npm run dev` starts without errors
2. Navigating to `/editor/demo` shows the split layout
3. Editing any text field updates the canvas in real time (no delay, no full re-render flash)
4. Editing a color field updates the canvas background/text color instantly
5. Pricing and FAQ repeater items can be added and removed
6. Clicking "Preview" opens `/preview/demo` showing the clean site
7. The generated site is visually polished and mobile-responsive
