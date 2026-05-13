import type { TemplateSchema } from './types'

export const agencySchema: TemplateSchema = {
  id: 'agency',
  name: 'Agency Showcase',
  description: 'Sito portfolio per agenzie creative e studi di design. Lavori, servizi e contatti.',
  category: 'portfolio',
  sections: [
    {
      id: 'hero',
      label: 'Hero',
      blockType: 'hero',
      fields: [
        { id: 'headline',    type: 'text',  label: 'Titolo principale', default: 'Studio Verdun\nBrand identity, digital, motion.' },
        { id: 'subheadline', type: 'text',  label: 'Sottotitolo',       default: 'Lavoriamo con brand che hanno qualcosa da dire.', multiline: true },
        { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA',         default: 'Vedi i progetti' },
        { id: 'bgColor',     type: 'color', label: 'Sfondo',            default: '#0a0a0a' },
        { id: 'textColor',   type: 'color', label: 'Testo',             default: '#ffffff' },
        { id: 'accentColor', type: 'color', label: 'Colore accento',    default: '#d4ff3a' },
      ],
    },
    {
      id: 'work',
      label: 'Lavori',
      blockType: 'gallery',
      fields: [
        { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Lavori selezionati' },
        { id: 'layout',       type: 'text', label: 'Layout (masonry/uniform/two-col)', default: 'two-col' },
        {
          id: 'items',
          type: 'repeater',
          label: 'Progetti',
          default: [
            { image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80', caption: 'Rebranding — Caffè Verdi' },
            { image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80', caption: 'Campagna digitale — Moda SS25' },
            { image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80', caption: 'Motion identity — Studio Alpi' },
            { image: 'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=800&q=80', caption: 'Web design — Fondazione Arte' },
            { image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', caption: 'Packaging — Oleificio Bruni' },
            { image: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800&q=80', caption: 'Visual system — Fiera Milano' },
          ],
          itemSchema: [
            { id: 'image',   type: 'image', label: 'Immagine progetto', default: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80' },
            { id: 'caption', type: 'text',  label: 'Titolo progetto',   default: 'Progetto — Cliente' },
          ],
        },
      ],
    },
    {
      id: 'services',
      label: 'Servizi',
      blockType: 'features',
      fields: [
        { id: 'sectionTitle', type: 'text',  label: 'Titolo sezione', default: 'Cosa facciamo' },
        { id: 'accentColor',  type: 'color', label: 'Colore accento', default: '#d4ff3a' },
        {
          id: 'items',
          type: 'repeater',
          label: 'Servizi',
          default: [
            { icon: '◯', title: 'Brand Identity',    desc: 'Logo, sistema visivo, tipografia, colori. Costruiamo identità che reggono nel tempo.' },
            { icon: '▲', title: 'Web & Digital',     desc: 'Siti web, landing page, interfacce. Design e sviluppo front-end di qualità.' },
            { icon: '■', title: 'Motion & Video',    desc: 'Animazioni, video istituzionali, contenuti social. Il movimento che racconta il tuo brand.' },
          ],
          itemSchema: [
            { id: 'icon',  type: 'emoji', label: 'Icona / simbolo', default: '◯' },
            { id: 'title', type: 'text',  label: 'Titolo',          default: 'Servizio' },
            { id: 'desc',  type: 'text',  label: 'Descrizione',     default: 'Descrizione del servizio.' },
          ],
        },
      ],
    },
    {
      id: 'clients',
      label: 'Clienti',
      blockType: 'testimonials',
      fields: [
        { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Clienti' },
        {
          id: 'items',
          type: 'repeater',
          label: 'Testimonianze',
          default: [
            { quote: 'Studio Verdun ha trasformato la nostra identità visiva in qualcosa che davvero ci rappresenta. Ogni dettaglio è pensato, niente è lasciato al caso.', author: 'Paolo Neri', role: 'CEO, Caffè Verdi', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
            { quote: 'Il sito che hanno realizzato per noi ha migliorato le conversioni del 40%. Ma soprattutto, è bello. Ed è raro trovare entrambe le cose insieme.', author: 'Chiara Botti', role: 'Marketing Director, Fondazione Arte', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
            { quote: 'Professionisti veri. Rispettano i tempi, comunicano chiaramente e consegnano lavori che superano le aspettative. Torneremo certamente.', author: 'Andrea Sani', role: 'Brand Manager, Oleificio Bruni', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
          ],
          itemSchema: [
            { id: 'quote',  type: 'text',  label: 'Citazione',   default: 'Collaborazione eccellente.' },
            { id: 'author', type: 'text',  label: 'Nome',        default: 'Nome Cognome' },
            { id: 'role',   type: 'text',  label: 'Ruolo / azienda', default: 'CEO, Azienda' },
            { id: 'avatar', type: 'image', label: 'Foto avatar', default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
          ],
        },
      ],
    },
    {
      id: 'work-with-us',
      label: 'CTA',
      blockType: 'cta',
      fields: [
        { id: 'headline',  type: 'text',  label: 'Titolo',        default: 'Lavoriamo insieme?' },
        { id: 'subtext',   type: 'text',  label: 'Testo',         default: 'Hai un progetto interessante? Scrivici. Rispondiamo entro 48 ore.' },
        { id: 'ctaLabel',  type: 'text',  label: 'Testo bottone', default: 'Contattaci' },
        { id: 'bgColor',   type: 'color', label: 'Sfondo',        default: '#0a0a0a' },
        { id: 'textColor', type: 'color', label: 'Testo',         default: '#ffffff' },
      ],
    },
  ],
}
