# Add / Remove Sections (Shopify-style) — Design

**Status**: approved
**Date**: 2026-05-26
**Owner**: nicco

## Summary

Permettere all'utente di aggiungere nuove sezioni tra sezioni esistenti (e in coda) tramite un picker visivo con 30+ preset, e rimuovere sezioni esistenti — stile Shopify. Lo schema delle sezioni diventa mutabile a runtime, persistito su localStorage. Variant prop sui block components principali per varietà visiva oltre alle differenze di contenuto.

## Goals

- `+` inline tra ogni coppia di sezioni nel canvas (visibile all'hover).
- `+ Aggiungi sezione` nel sidebar (aggiunge in coda).
- Picker modale con 30+ layout preselezionabili (mix di varianti visive + preset di contenuto).
- Rimozione sezioni dal sidebar con `×` su hover + conferma inline.
- Persistenza, undo/redo, export coerenti col nuovo modello.

## Non-Goals

- Template "blank" da zero. Diventa banale una volta che lo store è mutabile — follow-up naturale, fuori scope di questa feature.
- Riordino drag-and-drop (già esiste).
- Duplicazione sezioni come UI esplicita (l'azione `duplicateSection` viene esposta nello store ma senza UI in questa iterazione).
- Block components nuovi. Si lavora solo sui 16 esistenti.
- Preview statici come immagini in `/public`. Si usa mini-rendering live scalato.

## Architecture

### Data model

`lib/schemas/types.ts`:

```ts
export interface Section {
  id: string
  label: string
  blockType: BlockType
  variant?: string         // NEW — opzionale, retrocompatibile
  fields: Field[]
}
```

Nessun flag `removable` sulla Section: la rimovibilità è derivata dalla posizione (`sectionOrder[0]` non rimovibile, tutto il resto sì). Più semplice e impossibile da desincronizzare.

`lib/presets/layouts.ts` (NEW):

```ts
export interface LayoutPreset {
  id: string                       // 'hero-bold', 'features-grid-3'
  label: string                    // 'Hero · bold centered'
  category: 'hero' | 'features' | 'content' | 'commerce' | 'social' | 'utility'
  blockType: BlockType
  variant?: string
  build: (uniqueId: string) => Section   // factory per Section
  defaultValues: Record<string, unknown> // valori iniziali per `values[newId]`
}

export const LAYOUT_PRESETS: LayoutPreset[]
```

### Store

`lib/store/editor.store.ts`:

```ts
interface EditorState {
  templateId: string
  schema: TemplateSchema        // resta solo per metadata (id, name, category)
  sections: Section[]           // NEW — fonte di verità mutabile
  sectionOrder: string[]
  values: TemplateValues
  elementOrder: Record<string, Record<string, number[]>>
  activeSection: string

  // History snapshots ora includono `sections`
  _past: Snapshot[]
  _future: Snapshot[]
  canUndo: boolean
  canRedo: boolean

  // Esistenti
  updateField(...)
  setActiveSection(...)
  reset()
  undo()
  redo()
  reorderSections(...)
  reorderElements(...)
  getElementOrder(...)
  exportTemplate()

  // NEW
  addSection(presetId: string, insertAfterId: string | null): void
  removeSection(sectionId: string): void
  duplicateSection(sectionId: string): void  // esposta, no UI in questa iter
}

interface Snapshot {
  sections: Section[]      // NEW nel snapshot
  sectionOrder: string[]
  values: TemplateValues
}
```

**Init**: al primo caricamento, `sections = schema.sections` (deep clone). Da quel momento lo store è autoritativo. **Regola di rimovibilità**: la sezione in `sectionOrder[0]` (tipicamente hero) non è mai rimovibile — garantisce che la pagina non sia mai vuota. Tutte le altre sono rimovibili, sia originali del template che aggiunte runtime.

**Storage shape** (`localStorage` key `readylayout-${templateId}`):

```ts
{
  sections: Section[]
  sectionOrder: string[]
  values: TemplateValues
  elementOrder: Record<string, Record<string, number[]>>
}
```

**Migrazione**: se `sections` manca dal payload salvato (utenti pre-feature), ricostruito da `schema.sections`. Nessuna perdita di dati.

**ID generation**: nuove sezioni hanno id `${blockType}-${nanoid(6)}` (es. `hero-x7k2p9`). Evita collisioni con multiple Hero, Features, ecc.

### Action semantics

**`addSection(presetId, insertAfterId)`**:
1. Trova il preset in `LAYOUT_PRESETS`.
2. Genera `newId = ${blockType}-${nanoid(6)}`.
3. `newSection = preset.build(newId)` — clona fields, label, variant.
4. Inserisce `newSection` in `sections`.
5. Inserisce `newId` in `sectionOrder` subito dopo `insertAfterId` (o in coda se `null`).
6. `values[newId] = structuredClone(preset.defaultValues)`.
7. Snapshot in `_past`, svuota `_future`, persisti su localStorage.
8. Effetto collaterale UI: imposta `activeSection = newId`, scrolla la nuova sezione in vista nel canvas.

**`removeSection(sectionId)`**:
1. No-op se `sectionId === sectionOrder[0]` (regola hero non rimovibile).
2. Rimuove da `sections`, `sectionOrder`, `values`, `elementOrder`.
3. Se era `activeSection`, sposta su quella precedente (o la prima).
4. Snapshot in `_past`, svuota `_future`, persisti.

**`duplicateSection(sectionId)`** (no UI, esposta nello store):
1. Trova la section originale e i suoi values.
2. Crea `newId` e Section clonata.
3. Inserisce subito dopo `sectionId` in `sectionOrder`.
4. Clona deep dei values.

**`reset()`**: torna a `schema.sections` originali + `values` di default.

**`exportTemplate()`**: ritorna `{ templateId, name, category, sections, sectionOrder, values, elementOrder }`. Output auto-contenuto, non più dipendente dallo schema in lib.

## UI

### `<SectionInserter />` (nuovo)

`components/editor/SectionInserter.tsx`. Renderizzato dentro `TemplateRenderer` tra ogni `DraggableSection` (e una volta sopra la prima, una volta sotto l'ultima).

- Drop zone hot area ~24px verticali, contenuto inizialmente invisibile.
- All'hover: linea orizzontale 1px accent + bottone pillola al centro `[ + Aggiungi sezione ]`.
- Click → apre `<LayoutPickerModal />` con `insertAfterId` corretto.
- Transition: `opacity var(--dur-hover) var(--ease-out)`.

### Sidebar — bottone "Aggiungi sezione"

In `components/editor/Sidebar.tsx`, sotto la lista sezioni (sopra la "Fields" area), bottone full-width:

```
[ + Aggiungi sezione ]
```

Click → apre `<LayoutPickerModal />` con `insertAfterId = ultima sezione` (di fatto in coda).

### Sidebar — pulsante rimuovi (`×`)

In ogni riga di sezione del sidebar, a destra del label, una `×` con `opacity: 0` → `1` su hover row. Click → conferma inline ("Rimuovere? [Sì] [Annulla]"). Conferma → `removeSection`. La prima sezione di `sectionOrder` non mostra mai `×`.

### `<LayoutPickerModal />` (nuovo)

`components/editor/LayoutPicker.tsx`.

**Props**: `{ open: boolean, insertAfterId: string | null, onClose: () => void }`.

**Stato locale**: search query, category filter selezionata.

**Layout**:
- Overlay scuro full-screen, modal centrato.
- Width 960px max, 90vw. Height 80vh. Border-radius coerente col design system.
- Header: titolo "Aggiungi sezione" + close `×`.
- Toolbar: input search a sinistra, chips di categoria (`Tutti` | `Hero` | `Features` | `Content` | `Commerce` | `Social` | `Utility`).
- Body: grid 4 colonne (responsive: 3 a < 900px contenuto, 2 a < 600px), gap 16px, scroll interno.
- Card: 240×~200px. Thumb 240×160 con mini-render live (vedi sotto), label sotto.

**Mini-render preview**: ogni card monta il block component reale con `defaultValues` del preset, dentro un wrapper:

```tsx
<div style={{ width: 240, height: 160, overflow: 'hidden', position: 'relative', pointerEvents: 'none' }}>
  <div style={{ width: 1280, transform: 'scale(0.1875)', transformOrigin: 'top left' }}>
    <BlockRenderer blockType={preset.blockType} sectionId={preset.id} values={preset.defaultValues} variant={preset.variant} />
  </div>
</div>
```

`pointer-events: none` impedisce interazione interna. `sectionId` passato a `BlockRenderer` è arbitrario — verificato che né `BlockRenderer` né i singoli block leggono dallo store (lavorano solo sui `values` passati come prop), quindi la preview può essere renderizzata fuori da `EditorProvider` senza side-effects.

**Interazione**:
- Click card → `addSection(presetId, insertAfterId)` → `onClose()`.
- ESC chiude.
- Click su overlay chiude.
- Filtro: chip + search applicati AND. Search match su `label` (case-insensitive substring).
- Stato vuoto: "Nessun layout trovato".

## Variant system

Ogni block component dei 16 in `components/blocks/` accetta un prop opzionale `variant?: string` (oltre ai prop esistenti). Default (variant undefined) = layout attuale → nessuna regressione visiva per i template esistenti.

**Block che implementano realmente i variant** (priorità alta):
- Hero — `centered`, `split-left`, `split-right`, `bold`
- Features — `grid-3`, `grid-4`, `alternating`
- About — `image-left`, `image-right`, `text-only`
- CTA — `centered`, `split`, `banner`
- Testimonials — `grid`, `single-quote`, `carousel-static`
- FAQ — `accordion`, `two-column`
- Pricing — `three-tier`, `two-tier`
- Gallery — `grid-3`, `masonry`, `featured`
- Stats — `inline`, `cards`
- Articles — `grid`, `list`
- TextBlock — `narrow`, `wide`
- Contact — `split`, `centered`

**Block senza variant per ora** (accettano il prop ma lo ignorano, una sola opzione):
- Menu, Products, Schedule, LinkList

**Implementazione**: dentro ogni block, switch sul `variant` che cambia layout CSS (grid-template-columns, flex-direction, max-width, ordering). I **field** restano identici per ogni variant dello stesso blockType — l'utente può teoricamente cambiare variant senza perdere dati. (UI per cambiare variant a sezione esistente: nice-to-have, fuori scope di questa iterazione.)

## Preset count

Tabella preset (target ~35):

| Block        | Preset count |
|--------------|--------------|
| Hero         | 4            |
| Features     | 3            |
| About        | 3            |
| CTA          | 3            |
| FAQ          | 2            |
| Pricing      | 2            |
| Testimonials | 3            |
| Gallery      | 3            |
| Stats        | 2            |
| Articles     | 2            |
| TextBlock    | 2            |
| Contact      | 2            |
| Menu         | 1            |
| Products     | 1            |
| Schedule     | 1            |
| LinkList     | 1            |
| **Totale**   | **35**       |

Le combinazioni variant × contenuto/colore generano la varietà visiva. Estendibile aggiungendo voci a `LAYOUT_PRESETS` senza altre modifiche.

## File touch list

**Nuovi**:
- `lib/presets/layouts.ts`
- `components/editor/SectionInserter.tsx`
- `components/editor/LayoutPicker.tsx`

**Modificati**:
- `lib/schemas/types.ts` — `Section.variant`, `Section.removable`
- `lib/store/editor.store.ts` — `sections` mutabile, `addSection`/`removeSection`/`duplicateSection`, snapshot, persistenza, migrazione
- `components/TemplateRenderer.tsx` — usa `sections` dallo store invece di `schema.sections`, inserisce `<SectionInserter>` tra ogni coppia
- `components/editor/Sidebar.tsx` — usa `sections` dallo store, bottone "Aggiungi sezione" in fondo lista, `×` rimuovi per riga
- `components/blocks/Hero.tsx`, `Features.tsx`, `About.tsx`, `CTA.tsx`, `Testimonials.tsx`, `FAQ.tsx`, `Pricing.tsx`, `Gallery.tsx`, `Stats.tsx`, `Articles.tsx`, `TextBlock.tsx`, `ContactForm.tsx` — accettano e gestiscono `variant`
- `components/blocks/Menu.tsx`, `Products.tsx`, `Schedule.tsx`, `LinkList.tsx` — accettano `variant` (ignorato)
- `components/blocks/BlockRenderer.tsx` — passa `variant` ai child
- `app/canvas/[templateId]/CanvasContent.tsx` — `StorageSyncer` sincronizza anche `sections`

## Testing strategy

- Unit (jest): `addSection` / `removeSection` / `duplicateSection` — snapshot shape, ordering, values clone, undo/redo, blocco rimozione prima sezione.
- Unit: migrazione storage (payload vecchio senza `sections` → ricostruito).
- Unit: `LAYOUT_PRESETS` integrità (id univoci, blockType esistente, defaultValues match con fields del Section.build).
- Integration (jest + RTL): Sidebar mostra `×` solo su sezioni rimovibili; click apre conferma; conferma rimuove.
- E2E manuale: aggiungi 3 sezioni da posizioni diverse → ordine corretto, undo/redo coerenti, preview canvas riflette, export include nuove sezioni.

## Open follow-ups (post-MVP)

- Template "blank": crea un nuovo schema con solo hero o nessuna sezione e parti da lì.
- UI per cambiare `variant` su sezione esistente (toggle nel sidebar quando la sezione ha varianti).
- Duplica sezione: esporre `duplicateSection` con bottone nel sidebar.
- Preview statici delle card invece di mini-render live (perf su catalog grandi).
- Preset thumbnail screenshot caching.
