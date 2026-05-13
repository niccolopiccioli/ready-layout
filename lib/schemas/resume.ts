import type { TemplateSchema } from './types'

export const resumeSchema: TemplateSchema = {
  id: 'resume',
  name: 'Resume / CV',
  description: 'CV digitale per professionisti in cerca di opportunità. Profilo, highlights e link.',
  category: 'personal',
  sections: [
    {
      id: 'hero',
      label: 'Hero',
      blockType: 'hero',
      fields: [
        { id: 'headline',    type: 'text',  label: 'Titolo principale', default: 'Andrea Verde\nProduct Designer' },
        { id: 'subheadline', type: 'text',  label: 'Sottotitolo',       default: 'Cerco opportunità in Europa · Disponibile da maggio 2026', multiline: true },
        { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA',         default: 'Scarica CV' },
        { id: 'bgColor',     type: 'color', label: 'Sfondo',            default: '#faf8f5' },
        { id: 'textColor',   type: 'color', label: 'Testo',             default: '#0f172a' },
        { id: 'accentColor', type: 'color', label: 'Colore accento',    default: '#1e3a5f' },
      ],
    },
    {
      id: 'summary',
      label: 'Profilo',
      blockType: 'about',
      fields: [
        { id: 'eyebrow',   type: 'text',  label: 'Occhiello',  default: 'Profilo' },
        { id: 'headline',  type: 'text',  label: 'Titolo',     default: '8 anni a progettare\nprodotti digitali usati da milioni.' },
        { id: 'body',      type: 'text',  label: 'Corpo testo', default: 'Sono un Product Designer con 8 anni di esperienza in startup e scale-up europee. Ho lavorato su prodotti B2B SaaS, consumer app e piattaforme editoriali. Il mio approccio è centrato sull\'utente: parto sempre dalla ricerca, iterativo, misuro i risultati. Ho lanciato 12 prodotti dal concept alla produzione, collaborando con team di ingegneria, marketing e leadership. Parlo italiano, inglese e francese. Sono aperto a posizioni full-time e contratti a lungo termine in Italia e Europa.', multiline: true },
        { id: 'image',     type: 'image', label: 'Foto',       default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
        { id: 'bgColor',   type: 'color', label: 'Sfondo',     default: '#ffffff' },
        { id: 'textColor', type: 'color', label: 'Testo',      default: '#0f172a' },
      ],
    },
    {
      id: 'highlights',
      label: 'Highlights',
      blockType: 'stats',
      fields: [
        {
          id: 'items',
          type: 'repeater',
          label: 'Dati chiave',
          default: [
            { value: '8 anni',    label: 'esperienza' },
            { value: '12',        label: 'prodotti lanciati' },
            { value: '3 lingue',  label: 'fluenti' },
            { value: 'EU',        label: 'autorizzato a lavorare' },
          ],
          itemSchema: [
            { id: 'value', type: 'text', label: 'Valore',    default: '—' },
            { id: 'label', type: 'text', label: 'Etichetta', default: 'descrizione' },
          ],
        },
        { id: 'bgColor',   type: 'color', label: 'Sfondo', default: '#1e3a5f' },
        { id: 'textColor', type: 'color', label: 'Testo',  default: '#f0f6ff' },
      ],
    },
    {
      id: 'links',
      label: 'Link',
      blockType: 'linklist',
      fields: [
        { id: 'name',        type: 'text',  label: 'Nome',           default: 'Andrea Verde' },
        { id: 'bio',         type: 'text',  label: 'Bio',            default: 'Trovami online', multiline: true },
        { id: 'avatar',      type: 'image', label: 'Foto avatar',    default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
        { id: 'bgColor',     type: 'color', label: 'Sfondo',         default: '#0f172a' },
        { id: 'textColor',   type: 'color', label: 'Testo',          default: '#f8fafc' },
        { id: 'accentColor', type: 'color', label: 'Colore accento', default: '#4d9eff' },
        {
          id: 'links',
          type: 'repeater',
          label: 'Link',
          default: [
            { label: 'LinkedIn',    url: 'https://linkedin.com/in/andrea-verde', emoji: '🔗' },
            { label: 'CV (PDF)',    url: 'https://example.com/cv.pdf',            emoji: '📄' },
            { label: 'Portfolio',   url: 'https://example.com/portfolio',         emoji: '📷' },
            { label: 'Email',       url: 'mailto:andrea@example.com',             emoji: '✉️' },
          ],
          itemSchema: [
            { id: 'label', type: 'text',  label: 'Testo del link', default: 'Link' },
            { id: 'url',   type: 'text',  label: 'URL',            default: 'https://' },
            { id: 'emoji', type: 'emoji', label: 'Emoji',          default: '🔗' },
          ],
        },
      ],
    },
  ],
}
