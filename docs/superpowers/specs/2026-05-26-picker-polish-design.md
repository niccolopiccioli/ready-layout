# Layout Picker Polish — Design

**Status**: approved
**Date**: 2026-05-26
**Owner**: nicco

## Summary

Risolve due problemi del `LayoutPicker` consegnato in Plan 1:

1. **Visibilità del modal**: quando aperto dal `+` inline nel canvas, il modal viene renderizzato dentro l'iframe e `position: fixed` lo ancora all'iframe (alto 2400+ px). Se l'utente è scrollato in basso, il modal compare in alto e bisogna scrollare per vederlo.
2. **Anteprime poco leggibili**: il mini-render attuale è `transform: scale(0.1875)` del block reale → testo microscopico, identità del layout non immediata.

Soluzione: spostare il `LayoutPicker` al parent window e renderlo accessibile via `LayoutPickerContext`; sostituire il mini-render con wireframe schematici colorati con accent.

## Non-Goals

- Cambiare il numero di preset (resta 8 da Plan 1).
- Aggiungere variant ai block components (Plan 2 generale).
- Modificare `addSection`/`removeSection`/store.
- Cambiare i trigger UI (`SectionInserter` inline, bottone sidebar).
- Screenshot statici come preview (over-engineering per ora).

## Architecture

### Picker lift — dal canvas al parent

Stato attuale (post Plan 1):
- `<EditorLayout>` (parent) → contiene `<Canvas>` (iframe) e `<Sidebar>`.
- `<Sidebar>` istanzia un proprio `<LayoutPicker>` (parent — funziona).
- `<TemplateRenderer>` (dentro iframe) istanzia un proprio `<LayoutPicker>` (clipping — bug).

Nuovo:
- **Singola istanza** di `<LayoutPicker>` montata in `<EditorLayout>`.
- Stato `pickerOpen` + `insertAfterId` vive in `EditorLayout`.
- Esposto via `LayoutPickerContext`:
  ```ts
  interface LayoutPickerContextValue {
    openPicker: (insertAfterId: string | null) => void
  }
  ```
- `<Sidebar>` consuma il context e chiama `openPicker(...)`.
- `<SectionInserter>` (dentro iframe) **non** consuma il context (context vive solo nel parent React tree). Invece manda `postMessage`:
  ```ts
  window.parent.postMessage({ type: 'readylayout-open-picker', insertAfterId }, '*')
  ```
  Pattern coerente con `readylayout-resize` e `readylayout-section-active` già esistenti.
- `<EditorLayout>` ascolta `message` events sul `window` e converte in `openPicker(insertAfterId)`.

Data flow per `addSection`:
- `LayoutPicker` (parent) chiama `useEditorStore().addSection(...)`.
- Lo store del parent scrive in `localStorage`.
- L'iframe `<StorageSyncer>` (già wired in Plan 1) riceve `storage` event e aggiorna lo store interno.
- Il canvas re-renderizza con la nuova sezione.
- Zero modifiche al data flow esistente.

### Wireframe preview

Nuovo componente `<WireframePreview />` in `components/editor/picker/WireframePreview.tsx`.

**Props**:
```ts
interface WireframePreviewProps {
  blockType: BlockType
  accentColor?: string
  bgColor?: string
  textColor?: string
}
```

I colori si pullano da `preset.defaultValues` quando disponibili. Default sicuri: `bgColor: '#ffffff'`, `textColor: '#0f172a'`, `accentColor: '#3b82f6'`.

**Rendering**: container `aspect-ratio: 3/2`, sfondo `bgColor`. Dentro, geometrie con `div` styling per simulare il layout. Niente testo reale, solo barre orizzontali (colore `textColor` con opacity bassa) che rappresentano righe. Niente font caricamento. Niente animazioni.

**Wireframe per blockType** (uno switch sul blockType):

| blockType    | Schema visivo |
|--------------|---------------|
| hero         | Bg pieno, 2 barre titolo grandi, 1 barra subhead, pillola CTA accent |
| features     | Barra titolo, riga 3 colonne con dot + 2 barre testo per colonna |
| about        | Split 50/50: rettangolo image-placeholder a destra, barre titolo+testo a sinistra |
| cta          | Block centrato con bg+accent, 1 barra titolo, pillola CTA accent |
| faq          | Barra titolo, 3 righe horizontal con caret `›` a destra |
| pricing      | Barra titolo, 3 card prezzo affiancate, quella centrale border accent |
| testimonials | Barra titolo, 2 card grandi con `"` decorativo |
| stats        | 3 colonne con numerone grande + label small |
| gallery      | Griglia 3×2 di rettangoli grigi |
| menu         | Header + 4 righe `dish ........ price` |
| products     | Griglia 3 colonne, ogni cell: rect prodotto + barra+prezzo |
| schedule     | Lista 5 righe con dot+barra orario |
| linklist     | Avatar circolare top, 4 pillole stacked |
| articles     | 3 card horizontal: thumb sx + titolo+barra dx |
| textblock    | Paragrafo: 5 barre centrate stretto |
| contact      | 3 input rect stacked + button accent |

Ogni wireframe è una funzione locale ~10-15 righe (puro JSX con stili inline). Fallback per blockType non gestito: card neutra con label `[blockType]` e bordo accent.

**Vantaggi rispetto al mini-render attuale**:
- Layout immediatamente leggibile (5 colonne ≠ 3 ≠ split).
- Identità del preset preservata via `accentColor` + `bgColor`.
- Niente dipendenze dallo store, niente mounting di block component reali, render istantaneo.
- Manutenibile: aggiungere blockType = aggiungere una funzione.

## File touch list

**Nuovi**:
- `components/editor/picker/LayoutPickerContext.tsx` — Context provider + hook.
- `components/editor/picker/WireframePreview.tsx` — Componente wireframe.

**Modificati**:
- `components/editor/EditorLayout.tsx` — Wrappa figli in `LayoutPickerProvider`, ascolta `postMessage`, renderizza singola `<LayoutPicker>`.
- `components/editor/LayoutPicker.tsx` — Sostituisce mini-render con `<WireframePreview>`.
- `components/editor/SectionInserter.tsx` — Rimuove prop `onClick`, postMessage al parent. Accetta `insertAfterId` come prop.
- `components/TemplateRenderer.tsx` — Rimuove import e usage di `LayoutPicker`, passa `insertAfterId` a `SectionInserter`.
- `components/editor/Sidebar.tsx` — Rimuove stato locale e istanza locale di `LayoutPicker`, consuma `useLayoutPicker()` context.

## Edge cases & decisioni

- **postMessage origin**: usiamo `'*'` come targetOrigin per ora (coerente col codice esistente). Tutto è same-origin in pratica.
- **Listener cleanup**: `EditorLayout` registra/disegistra il listener in `useEffect` con cleanup.
- **`insertAfterId` validation nel listener**: il parent verifica che sia `string | null` (incluso `''` sentinel) prima di chiamare `openPicker`. Messaggi malformati ignorati.
- **Re-entry**: se il picker è già aperto e arriva un nuovo `openPicker` (es. doppio click), si aggiorna `insertAfterId` ma non si chiude.
- **Default colors per WireframePreview**: se il preset non specifica `accentColor`, fallback a `var(--ed-accent)` (consistente con l'UI del picker).

## Testing strategy

- **Unit (jest)**:
  - `WireframePreview` rende il blockType giusto per ognuno dei 16 blockType (snapshot leggero o check struttura DOM).
  - Fallback per blockType non riconosciuto.
- **Integration manuale**:
  - Scroll al fondo del canvas → click `+` tra sezioni → modal compare al centro della viewport del parent (non dell'iframe).
  - Click `+` dal sidebar → modal compare al centro.
  - Cards mostrano wireframe distinguibili (hero ≠ features ≠ pricing).
  - Accent color del preset visibile nella preview.

## Open follow-ups

- Variant prop sui block components (Plan 2 generale).
- Espansione preset 8 → 35.
- Screenshot statici come fallback se il numero preset cresce.
- Drag-from-picker per posizionamento più visuale (Shopify ha questo).
