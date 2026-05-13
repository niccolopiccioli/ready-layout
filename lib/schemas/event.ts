import type { TemplateSchema } from './types'

export const eventSchema: TemplateSchema = {
  id: 'event',
  name: 'Event Page',
  description: 'Pagina evento per conferenze, meetup e cerimonie. Programma, luogo e iscrizioni.',
  category: 'event',
  sections: [
    {
      id: 'hero',
      label: 'Hero',
      blockType: 'hero',
      fields: [
        { id: 'headline',    type: 'text',  label: 'Titolo principale', default: 'MicroConf Italia 2026\n3 giorni a Bologna' },
        { id: 'subheadline', type: 'text',  label: 'Sottotitolo',       default: '27–29 marzo · Palazzo Re Enzo · 400 partecipanti', multiline: true },
        { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA',         default: 'Iscriviti all\'evento' },
        { id: 'bgColor',     type: 'color', label: 'Sfondo',            default: '#1f0a0a' },
        { id: 'textColor',   type: 'color', label: 'Testo',             default: '#f5ede0' },
        { id: 'accentColor', type: 'color', label: 'Colore accento',    default: '#c9994d' },
      ],
    },
    {
      id: 'program',
      label: 'Programma',
      blockType: 'schedule',
      fields: [
        { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Programma' },
        { id: 'date',         type: 'text', label: 'Data',           default: '27 marzo 2026' },
        {
          id: 'items',
          type: 'repeater',
          label: 'Sessioni',
          default: [
            { time: '09:30', title: 'Keynote di apertura',                  speaker: 'Marco Rossi',    location: 'Sala Magna' },
            { time: '11:00', title: 'Come trovare i primi 100 clienti',     speaker: 'Giada Ferretti', location: 'Sala A' },
            { time: '13:00', title: 'Pausa pranzo',                         speaker: '',               location: 'Cortile' },
            { time: '14:30', title: 'Pricing per software B2B',             speaker: 'Luca Moretti',   location: 'Sala Magna' },
            { time: '16:00', title: 'Tavola rotonda: crescere senza VC',    speaker: 'Panel 5 speaker',location: 'Sala B' },
          ],
          itemSchema: [
            { id: 'time',     type: 'text', label: 'Orario',      default: '09:00' },
            { id: 'title',    type: 'text', label: 'Titolo',      default: 'Sessione' },
            { id: 'speaker',  type: 'text', label: 'Speaker',     default: '' },
            { id: 'location', type: 'text', label: 'Luogo/Sala',  default: 'Sala principale' },
          ],
        },
      ],
    },
    {
      id: 'venue',
      label: 'Il luogo',
      blockType: 'about',
      fields: [
        { id: 'eyebrow',   type: 'text',  label: 'Occhiello',  default: 'Il luogo' },
        { id: 'headline',  type: 'text',  label: 'Titolo',     default: 'Palazzo Re Enzo,\nnel cuore di Bologna.' },
        { id: 'body',      type: 'text',  label: 'Corpo testo', default: 'Il Palazzo Re Enzo è uno dei luoghi storici più affascinanti di Bologna. Situato in piazza del Nettuno, è raggiungibile a piedi dalla stazione centrale in 15 minuti. Bologna è facilmente raggiungibile in treno da Milano (65 min), Roma (2h10) e Firenze (35 min). Abbiamo stretto accordi con tre hotel nelle vicinanze per tariffe riservate agli iscritti all\'evento.', multiline: true },
        { id: 'image',     type: 'image', label: 'Immagine',   default: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80' },
        { id: 'bgColor',   type: 'color', label: 'Sfondo',     default: '#f5ede0' },
        { id: 'textColor', type: 'color', label: 'Testo',      default: '#1f0a0a' },
      ],
    },
    {
      id: 'registration',
      label: 'Iscrizione',
      blockType: 'contact',
      fields: [
        { id: 'sectionTitle',      type: 'text',  label: 'Titolo sezione',        default: 'Iscriviti' },
        { id: 'subtext',           type: 'text',  label: 'Sottotitolo',           default: 'I posti sono limitati a 400 partecipanti. Compila il form per ricevere i dettagli di pagamento e confermare la tua iscrizione.', multiline: true },
        { id: 'submitLabel',       type: 'text',  label: 'Testo bottone invio',   default: 'Conferma iscrizione' },
        { id: 'emailPlaceholder',  type: 'text',  label: 'Placeholder email',     default: 'La tua email' },
        { id: 'showName',          type: 'text',  label: 'Mostra campo nome (true/false)', default: 'true' },
        { id: 'showMessage',       type: 'text',  label: 'Mostra campo messaggio (true/false)', default: 'false' },
        { id: 'bgColor',           type: 'color', label: 'Sfondo',                default: '#1f0a0a' },
        { id: 'textColor',         type: 'color', label: 'Testo',                 default: '#f5ede0' },
      ],
    },
  ],
}
