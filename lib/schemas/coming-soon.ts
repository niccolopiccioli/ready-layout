import type { TemplateSchema } from './types'

export const comingSoonSchema: TemplateSchema = {
  id: 'coming-soon',
  name: 'Coming Soon',
  description: 'Pagina pre-lancio con lista d\'attesa. Perfetta per raccogliere iscrizioni prima del lancio.',
  category: 'landing',
  sections: [
    {
      id: 'hero',
      label: 'Hero',
      blockType: 'hero',
      fields: [
        { id: 'headline',    type: 'text',  label: 'Titolo principale', default: 'Stiamo costruendo\nqualcosa di nuovo.' },
        { id: 'subheadline', type: 'text',  label: 'Sottotitolo',       default: 'Iscriviti per essere tra i primi ad accedere.', multiline: true },
        { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA',         default: 'Avvisami al lancio' },
        { id: 'bgColor',     type: 'color', label: 'Sfondo',            default: '#0a1628' },
        { id: 'textColor',   type: 'color', label: 'Testo',             default: '#e8f0fe' },
        { id: 'accentColor', type: 'color', label: 'Colore accento',    default: '#4d9eff' },
      ],
    },
    {
      id: 'metrics',
      label: 'Metriche',
      blockType: 'stats',
      fields: [
        {
          id: 'items',
          type: 'repeater',
          label: 'Statistiche',
          default: [
            { value: '2.847', label: 'in lista d\'attesa' },
            { value: 'Q2 2026', label: 'lancio previsto' },
            { value: '12', label: 'paesi supportati' },
          ],
          itemSchema: [
            { id: 'value', type: 'text', label: 'Valore',    default: '100' },
            { id: 'label', type: 'text', label: 'Etichetta', default: 'descrizione' },
          ],
        },
        { id: 'bgColor',   type: 'color', label: 'Sfondo', default: '#0d1f3c' },
        { id: 'textColor', type: 'color', label: 'Testo',  default: '#e8f0fe' },
      ],
    },
    {
      id: 'waitlist',
      label: 'Lista d\'attesa',
      blockType: 'contact',
      fields: [
        { id: 'sectionTitle',      type: 'text',  label: 'Titolo sezione',        default: 'Entra in lista' },
        { id: 'subtext',           type: 'text',  label: 'Sottotitolo',           default: 'Inserisci la tua email e ti avviseremo non appena apriremo l\'accesso. Nessuno spam, promesso.', multiline: true },
        { id: 'submitLabel',       type: 'text',  label: 'Testo bottone invio',   default: 'Aggiungimi' },
        { id: 'emailPlaceholder',  type: 'text',  label: 'Placeholder email',     default: 'La tua email' },
        { id: 'showName',          type: 'text',  label: 'Mostra campo nome (true/false)', default: 'false' },
        { id: 'showMessage',       type: 'text',  label: 'Mostra campo messaggio (true/false)', default: 'false' },
        { id: 'bgColor',           type: 'color', label: 'Sfondo',                default: '#0a1628' },
        { id: 'textColor',         type: 'color', label: 'Testo',                 default: '#e8f0fe' },
      ],
    },
  ],
}
