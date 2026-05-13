import type { TemplateSchema } from './types'

export const blogSchema: TemplateSchema = {
  id: 'blog',
  name: 'Personal Blog',
  description: 'Blog personale per scrittori e giornalisti. Feed articoli, bio e archivio.',
  category: 'content',
  sections: [
    {
      id: 'hero',
      label: 'Hero',
      blockType: 'hero',
      fields: [
        { id: 'headline',    type: 'text',  label: 'Titolo principale', default: 'Note dal margine\nScritti su filosofia, libri, e mestiere.' },
        { id: 'subheadline', type: 'text',  label: 'Sottotitolo',       default: 'Ogni settimana un saggio, una nota, un pezzo di pensiero.', multiline: true },
        { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA',         default: 'Leggi gli ultimi articoli' },
        { id: 'bgColor',     type: 'color', label: 'Sfondo',            default: '#faf8f5' },
        { id: 'textColor',   type: 'color', label: 'Testo',             default: '#0f172a' },
        { id: 'accentColor', type: 'color', label: 'Colore accento',    default: '#475569' },
      ],
    },
    {
      id: 'feed',
      label: 'Articoli',
      blockType: 'articles',
      fields: [
        { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Articoli recenti' },
        {
          id: 'items',
          type: 'repeater',
          label: 'Articoli',
          default: [
            {
              title: 'Sulla lentezza come metodo',
              excerpt: 'Viviamo in un\'epoca ossessionata dalla velocità. Ma cosa succederebbe se rallentare fosse l\'unico modo per capire davvero qualcosa? Un tentativo di risposta attraverso Calvino, il pane e i treni notturni.',
              date: '12 marzo 2026',
              image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
              tag: 'saggio',
            },
            {
              title: 'I libri che non riesco a finire (e perché va bene)',
              excerpt: 'Ho una pila di libri abbandonati a pagina 80. Una confessione e un ragionamento sulla libertà del lettore.',
              date: '28 febbraio 2026',
              image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
              tag: 'lettura',
            },
            {
              title: 'Diario di un mese senza social media',
              excerpt: 'Ho spento tutto per trenta giorni. Cosa ho trovato nel silenzio, cosa mi è mancato, cosa non rimetterò.',
              date: '14 febbraio 2026',
              image: 'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=800&q=80',
              tag: 'diario',
            },
            {
              title: 'Come scrivere quando non hai niente da dire',
              excerpt: 'La pagina bianca non è il nemico. È un interlocutore difficile. Qualche tecnica concreta che uso quando il blocco sembra invalicabile.',
              date: '2 febbraio 2026',
              image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
              tag: 'mestiere',
            },
          ],
          itemSchema: [
            { id: 'title',   type: 'text',  label: 'Titolo articolo', default: 'Titolo del post' },
            { id: 'excerpt', type: 'text',  label: 'Estratto',        default: 'Breve descrizione dell\'articolo.', },
            { id: 'date',    type: 'text',  label: 'Data',            default: '1 gennaio 2026' },
            { id: 'image',   type: 'image', label: 'Immagine',        default: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80' },
            { id: 'tag',     type: 'text',  label: 'Tag / categoria', default: 'saggio' },
          ],
        },
      ],
    },
    {
      id: 'about',
      label: 'Chi scrive',
      blockType: 'about',
      fields: [
        { id: 'eyebrow',   type: 'text',  label: 'Occhiello',  default: 'Chi scrive' },
        { id: 'headline',  type: 'text',  label: 'Titolo',     default: 'Sono Elena Ferretti.\nScrivo per capire le cose.' },
        { id: 'body',      type: 'text',  label: 'Corpo testo', default: 'Sono una giornalista freelance e saggista con base a Roma. Ho scritto per Internazionale, Il Foglio e diverse riviste letterarie. "Note dal margine" è il mio spazio privato — un luogo dove posso esplorare idee senza commissioni né scadenze. Esco ogni venerdì, o quasi.', multiline: true },
        { id: 'image',     type: 'image', label: 'Immagine',   default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
        { id: 'bgColor',   type: 'color', label: 'Sfondo',     default: '#faf8f5' },
        { id: 'textColor', type: 'color', label: 'Testo',      default: '#0f172a' },
      ],
    },
  ],
}
