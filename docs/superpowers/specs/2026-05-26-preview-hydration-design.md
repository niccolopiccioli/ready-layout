# Preview Hydration from localStorage — Design

**Status**: approved
**Date**: 2026-05-26
**Owner**: nicco

## Summary

La pagina `/preview/[templateId]` mostra il template statico anche quando l'utente ha aggiunto/rimosso sezioni nell'editor. Causa: server component che legge solo `schema` statico da `getTemplateById`, ignora `localStorage`. Fix: aggiungere un client wrapper `<PreviewContent>` che idrata da `localStorage` con SSR fallback ai defaults dello schema.

I thumbnail della gallery (`<TemplateThumb>`) puntano allo stesso route ma non devono mostrare le modifiche dell'utente — usano un query param `?clean=true` per saltare l'idratazione e restare neutri.

## Non-Goals

- Cambiare il comportamento di `TemplateRenderer editable={false}` — resta lo stesso.
- Persistere altro che `sections + sectionOrder + values` (già coperti da Plan 1).
- Mostrare le modifiche live durante l'editing della stessa tab (l'editor è in un'altra route).
- Salvataggio cloud / multi-device sync (out of scope, localStorage only).

## Architecture

```
PreviewPage (server, app/preview/[templateId]/page.tsx)
  ├─ getTemplateById(templateId) → schema statico
  ├─ buildDefaults(schema) → defaults da fields
  └─ <PreviewContent schema={schema} defaultValues={defaults} />   ← rendea client wrapper

PreviewContent (client, app/preview/[templateId]/PreviewContent.tsx)
  ├─ useSearchParams() → check `clean`
  ├─ state iniziale: { sections: schema.sections, sectionOrder: schema.sections.map(s=>s.id), values: defaultValues }
  ├─ useEffect mount:
  │   - if clean === 'true' → skip
  │   - else: legge localStorage `readylayout-${schema.id}` con try/catch
  │   - se ha sections/sectionOrder/values → setState
  ├─ useEffect storage listener:
  │   - se clean → skip
  │   - else: listener su `storage` events per la stessa key, aggiorna state se cambia
  └─ <TemplateRenderer schema={{...schema, sections: ordered}} values={effectiveValues} editable={false} />
```

**Logica di ordering**: l'effective schema usa `sectionOrder` per riordinare le sections salvate. Sections con id non in `sectionOrder` sono escluse (coerente col comportamento editor).

**Edge cases**:
- `localStorage` undefined (SSR/private mode) → useEffect non parte mai server-side; client se manca, fallback ai defaults.
- JSON malformato → try/catch silenzioso, fallback ai defaults.
- Schema cambia in dev mode → la versione salvata ha sections auto-contenute (Plan 1 Task 3), quindi sopravvive a schema changes.
- `clean=true` → skip totale dell'idratazione. La preview mostra defaults dal server, niente fluttuazioni client-side. Pulito per gallery.
- Race con StorageSyncer dell'editor: il preview legge in `useEffect` mount, lo `storage` listener gestisce gli update successivi. Niente flicker.

## TemplateThumb update

Singolo cambio: il src dell'iframe da `/preview/${templateId}` a `/preview/${templateId}?clean=true`. Niente altre modifiche.

## File touch list

**Nuovi**:
- `app/preview/[templateId]/PreviewContent.tsx` — client wrapper con idratazione
- `__tests__/app/preview/PreviewContent.test.tsx` — test idratazione

**Modificati**:
- `app/preview/[templateId]/page.tsx` — rendea `<PreviewContent>` invece di `<TemplateRenderer>` direttamente
- `components/TemplateThumb.tsx` — aggiunge `?clean=true` al src

## Testing strategy

**Unit (jest + RTL)**:
- `PreviewContent` con localStorage vuoto → renderizza schema defaults
- `PreviewContent` con localStorage popolato (sections aggiunte) → renderizza le sezioni salvate
- `PreviewContent` con `clean=true` searchParam → ignora localStorage anche se popolato
- `PreviewContent` con JSON malformato → fallback ai defaults senza crash

**Smoke manuale**:
- Editor: aggiungi 2 sezioni custom a startup-launchpad → apri `/preview/startup-launchpad` in nuova tab → vedi sezioni custom in ordine corretto con valori giusti
- Vai a `/` (home) → thumb di startup-launchpad mostra ancora il template originale, senza le sezioni custom
- Modifica un campo nell'editor → la preview tab si aggiorna automaticamente (storage listener)
- Pulisci localStorage → preview torna ai defaults

## Open follow-ups

- Cloud persistence (multi-device sync) — fuori scope.
- "Share preview link" che incorpora lo state in URL — fuori scope.
- Live preview accanto all'editor (split-view) — fuori scope, già coperto dal canvas iframe.
