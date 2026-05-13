import type { TemplateSchema } from './types'

export const portfolioSchema: TemplateSchema = {
  id: 'portfolio',
  name: 'Minimalist Portfolio',
  description: 'Portfolio essenziale per fotografi, designer e freelancer. Gallery, bio e contatti.',
  category: 'portfolio',
  sections: [
    {
      id: 'hero',
      label: 'Hero',
      blockType: 'hero',
      fields: [
        { id: 'headline',    type: 'text',  label: 'Titolo principale', default: 'Marco Bianchi\nFotografo & Visual Artist' },
        { id: 'subheadline', type: 'text',  label: 'Sottotitolo',       default: 'Racconto storie attraverso la luce.', multiline: true },
        { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA',         default: 'Vedi i lavori' },
        { id: 'bgColor',     type: 'color', label: 'Sfondo',            default: '#ffffff' },
        { id: 'textColor',   type: 'color', label: 'Testo',             default: '#0f172a' },
        { id: 'accentColor', type: 'color', label: 'Colore accento',    default: '#5b8a73' },
      ],
    },
    {
      id: 'work',
      label: 'Lavori',
      blockType: 'gallery',
      fields: [
        { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Lavori recenti' },
        { id: 'layout',       type: 'text', label: 'Layout (masonry/uniform/two-col)', default: 'masonry' },
        {
          id: 'items',
          type: 'repeater',
          label: 'Immagini',
          default: [
            { image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80', caption: 'Studio session — 2025' },
            { image: 'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=800&q=80', caption: 'Paesaggio urbano — Milano' },
            { image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', caption: 'Reportage — estate 2024' },
            { image: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800&q=80', caption: 'Ritratto editoriale — marzo 2025' },
            { image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80', caption: 'Progetto commerciale — 2025' },
            { image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80', caption: 'Architettura — Roma' },
          ],
          itemSchema: [
            { id: 'image',   type: 'image', label: 'Immagine', default: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80' },
            { id: 'caption', type: 'text',  label: 'Didascalia', default: 'Progetto — 2025' },
          ],
        },
      ],
    },
    {
      id: 'about',
      label: 'Bio',
      blockType: 'about',
      fields: [
        { id: 'eyebrow',   type: 'text',  label: 'Occhiello',  default: 'Bio' },
        { id: 'headline',  type: 'text',  label: 'Titolo',     default: 'Faccio foto da quando avevo 14 anni.' },
        { id: 'body',      type: 'text',  label: 'Corpo testo', default: 'Sono un fotografo freelance basato a Milano con oltre dieci anni di esperienza nel ritratto editoriale e nella fotografia di paesaggio. Il mio approccio è minimale: luce naturale, pochi elementi, molta attenzione al dettaglio. Ho collaborato con brand come Vogue Italia, Wallpaper* e diverse agenzie creative europee. Se hai un progetto in mente, scrivimi — mi piace lavorare con persone che hanno una visione chiara.', multiline: true },
        { id: 'image',     type: 'image', label: 'Immagine',   default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
        { id: 'bgColor',   type: 'color', label: 'Sfondo',     default: '#f8fafc' },
        { id: 'textColor', type: 'color', label: 'Testo',      default: '#0f172a' },
      ],
    },
    {
      id: 'contact',
      label: 'Contatti',
      blockType: 'contact',
      fields: [
        { id: 'sectionTitle',      type: 'text',  label: 'Titolo sezione',        default: 'Lavoriamo insieme' },
        { id: 'subtext',           type: 'text',  label: 'Sottotitolo',           default: 'Hai un progetto editoriale, commerciale o personale? Raccontami di cosa hai bisogno.', multiline: true },
        { id: 'submitLabel',       type: 'text',  label: 'Testo bottone invio',   default: 'Invia messaggio' },
        { id: 'emailPlaceholder',  type: 'text',  label: 'Placeholder email',     default: 'La tua email' },
        { id: 'showName',          type: 'text',  label: 'Mostra campo nome (true/false)', default: 'true' },
        { id: 'showMessage',       type: 'text',  label: 'Mostra campo messaggio (true/false)', default: 'true' },
        { id: 'bgColor',           type: 'color', label: 'Sfondo',                default: '#ffffff' },
        { id: 'textColor',         type: 'color', label: 'Testo',                 default: '#0f172a' },
      ],
    },
  ],
}
