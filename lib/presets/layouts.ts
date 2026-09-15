import type { BlockType, Section } from '@/lib/schemas/types'

export interface LayoutPreset {
  id: string
  label: string
  category: 'hero' | 'features' | 'content' | 'commerce' | 'social' | 'utility'
  blockType: BlockType
  variant?: string
  build: (uniqueId: string) => Section
  defaultValues: Record<string, unknown>
}

const heroFields: Section['fields'] = [
  { id: 'headline',    type: 'text',  label: 'Titolo principale', default: 'Titolo' },
  { id: 'subheadline', type: 'text',  label: 'Sottotitolo',       default: 'Sottotitolo', multiline: true },
  { id: 'badge',       type: 'text',  label: 'Etichetta (opz.)', default: '' },
  { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA',         default: 'Inizia' },
  { id: 'footnote',    type: 'text',  label: 'Nota sotto CTA',    default: '' },
  { id: 'bgColor',     type: 'color', label: 'Sfondo',            default: '#0f172a' },
  { id: 'textColor',   type: 'color', label: 'Testo',             default: '#f8fafc' },
  { id: 'accentColor', type: 'color', label: 'Colore accento',    default: '#3b82f6' },
]

const featuresFields: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Funzionalità' },
  { id: 'subtext',      type: 'text', label: 'Sottotitolo', default: '', multiline: true },
  { id: 'bgColor',      type: 'color', label: 'Sfondo', default: '#ffffff' },
  { id: 'textColor',    type: 'color', label: 'Testo', default: '#0f172a' },
  {
    id: 'items',
    type: 'repeater',
    label: 'Funzionalità',
    default: [
      { icon: '⚡', title: 'Veloce', body: 'Performance eccellente.' },
      { icon: '🎯', title: 'Preciso', body: 'Risultati accurati.' },
      { icon: '🔒', title: 'Sicuro', body: 'Dati protetti.' },
    ],
    itemSchema: [
      { id: 'icon',  type: 'emoji', label: 'Icona', default: '✦' },
      { id: 'title', type: 'text',  label: 'Titolo', default: 'Titolo' },
      { id: 'body',  type: 'text',  label: 'Descrizione', default: 'Descrizione' },
    ],
  },
]

const aboutFields: Section['fields'] = [
  { id: 'eyebrow',   type: 'text',  label: 'Occhiello',  default: 'About' },
  { id: 'headline',  type: 'text',  label: 'Titolo',     default: 'Chi siamo' },
  { id: 'body',      type: 'text',  label: 'Corpo testo', default: 'Racconta la tua storia.', multiline: true },
  { id: 'image',     type: 'image', label: 'Immagine',   default: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
  { id: 'bgColor',   type: 'color', label: 'Sfondo',     default: '#f8fafc' },
  { id: 'textColor', type: 'color', label: 'Testo',      default: '#0f172a' },
]

const ctaFields: Section['fields'] = [
  { id: 'headline',    type: 'text',  label: 'Titolo',  default: 'Pronto a iniziare?' },
  { id: 'subheadline', type: 'text',  label: 'Sottotitolo', default: 'Unisciti a chi ha già scelto.', multiline: true },
  { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA', default: 'Inizia ora' },
  { id: 'bgColor',     type: 'color', label: 'Sfondo', default: '#0f172a' },
  { id: 'textColor',   type: 'color', label: 'Testo', default: '#f8fafc' },
  { id: 'accentColor', type: 'color', label: 'Accento', default: '#3b82f6' },
]

const faqFields: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo', default: 'Domande frequenti' },
  { id: 'bgColor',      type: 'color', label: 'Sfondo', default: '#ffffff' },
  { id: 'textColor',    type: 'color', label: 'Testo', default: '#0f172a' },
  {
    id: 'items', type: 'repeater', label: 'Domande',
    default: [
      { question: 'Come funziona?', answer: 'Risposta alla domanda.' },
      { question: 'Quanto costa?', answer: 'Risposta alla domanda.' },
    ],
    itemSchema: [
      { id: 'question', type: 'text', label: 'Domanda', default: 'Domanda?' },
      { id: 'answer',   type: 'text', label: 'Risposta', default: 'Risposta.' },
    ],
  },
]

const pricingFields: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo', default: 'Prezzi' },
  { id: 'subtext',      type: 'text', label: 'Sottotitolo', default: 'Scegli il piano.', multiline: true },
  { id: 'bgColor',      type: 'color', label: 'Sfondo', default: '#ffffff' },
  { id: 'textColor',    type: 'color', label: 'Testo', default: '#0f172a' },
  { id: 'accentColor',  type: 'color', label: 'Accento', default: '#3b82f6' },
  {
    id: 'plans', type: 'repeater', label: 'Piani',
    default: [
      { name: 'Base',  price: '9€', period: '/mese', features: 'Caratteristica 1\nCaratteristica 2', ctaLabel: 'Scegli' },
      { name: 'Pro',   price: '29€', period: '/mese', features: 'Tutto di Base\nCaratteristica extra', ctaLabel: 'Scegli' },
      { name: 'Team',  price: '99€', period: '/mese', features: 'Tutto di Pro\nUtenti illimitati', ctaLabel: 'Scegli' },
    ],
    itemSchema: [
      { id: 'name',     type: 'text', label: 'Nome', default: 'Piano' },
      { id: 'price',    type: 'text', label: 'Prezzo', default: '9€' },
      { id: 'period',   type: 'text', label: 'Periodo', default: '/mese' },
      { id: 'features', type: 'text', label: 'Caratteristiche', default: '' },
      { id: 'ctaLabel', type: 'text', label: 'CTA', default: 'Scegli' },
    ],
  },
]

const testimonialsFields: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo', default: 'Dicono di noi' },
  { id: 'bgColor',      type: 'color', label: 'Sfondo', default: '#f8fafc' },
  { id: 'textColor',    type: 'color', label: 'Testo', default: '#0f172a' },
  {
    id: 'items', type: 'repeater', label: 'Testimonianze',
    default: [
      { quote: 'Servizio eccellente.', author: 'Mario Rossi', role: 'Cliente' },
      { quote: 'Lo consiglio a tutti.', author: 'Giulia Bianchi', role: 'Cliente' },
    ],
    itemSchema: [
      { id: 'quote',  type: 'text', label: 'Citazione', default: '"..."' },
      { id: 'author', type: 'text', label: 'Autore', default: 'Nome' },
      { id: 'role',   type: 'text', label: 'Ruolo', default: 'Cliente' },
    ],
  },
]

const statsFields: Section['fields'] = [
  { id: 'bgColor',   type: 'color', label: 'Sfondo', default: '#0f172a' },
  { id: 'textColor', type: 'color', label: 'Testo', default: '#f8fafc' },
  {
    id: 'items', type: 'repeater', label: 'Statistiche',
    default: [
      { value: '10k+', label: 'Utenti' },
      { value: '99%',  label: 'Soddisfazione' },
      { value: '24/7', label: 'Supporto' },
    ],
    itemSchema: [
      { id: 'value', type: 'text', label: 'Valore', default: '0' },
      { id: 'label', type: 'text', label: 'Etichetta', default: 'Etichetta' },
    ],
  },
]

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: 'hero-default',
    label: 'Hero · classico',
    category: 'hero',
    blockType: 'hero',
    build: (id) => ({ id, label: 'Hero', blockType: 'hero', fields: heroFields }),
    defaultValues: {
      headline: 'Il prodotto che cambia\ntutto.',
      subheadline: 'Spiegazione breve e diretta del valore offerto.',
      ctaLabel: 'Inizia gratis',
      bgColor: '#0f172a',
      textColor: '#f8fafc',
      accentColor: '#3b82f6',
    },
  },
  {
    id: 'features-grid-3',
    label: 'Features · griglia 3 colonne',
    category: 'features',
    blockType: 'features',
    build: (id) => ({ id, label: 'Funzionalità', blockType: 'features', fields: featuresFields }),
    defaultValues: {
      sectionTitle: 'Tutto quello che serve',
      subtext: 'Tre punti chiave della tua offerta.',
      bgColor: '#ffffff',
      textColor: '#0f172a',
      items: [
        { icon: '⚡', title: 'Veloce', body: 'Performance eccellente.' },
        { icon: '🎯', title: 'Preciso', body: 'Risultati accurati.' },
        { icon: '🔒', title: 'Sicuro', body: 'Dati protetti.' },
      ],
    },
  },
  {
    id: 'about-image-right',
    label: 'About · immagine a destra',
    category: 'content',
    blockType: 'about',
    build: (id) => ({ id, label: 'Chi siamo', blockType: 'about', fields: aboutFields }),
    defaultValues: {
      eyebrow: 'About',
      headline: 'La nostra storia',
      body: 'Racconta da dove vieni e cosa ti rende unico.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      bgColor: '#f8fafc',
      textColor: '#0f172a',
    },
  },
  {
    id: 'cta-centered',
    label: 'CTA · centrata',
    category: 'utility',
    blockType: 'cta',
    build: (id) => ({ id, label: 'Call to Action', blockType: 'cta', fields: ctaFields }),
    defaultValues: {
      headline: 'Pronto a iniziare?',
      subheadline: 'Unisciti a chi ha già scelto.',
      ctaLabel: 'Inizia ora',
      bgColor: '#0f172a',
      textColor: '#f8fafc',
      accentColor: '#3b82f6',
    },
  },
  {
    id: 'faq-accordion',
    label: 'FAQ · accordion',
    category: 'content',
    blockType: 'faq',
    build: (id) => ({ id, label: 'FAQ', blockType: 'faq', fields: faqFields }),
    defaultValues: {
      sectionTitle: 'Domande frequenti',
      bgColor: '#ffffff',
      textColor: '#0f172a',
      items: [
        { question: 'Come funziona?', answer: 'Risposta chiara.' },
        { question: 'Quanto costa?', answer: 'Risposta chiara.' },
        { question: 'Posso disdire?', answer: 'Sì, in qualsiasi momento.' },
      ],
    },
  },
  {
    id: 'pricing-three-tier',
    label: 'Pricing · 3 piani',
    category: 'commerce',
    blockType: 'pricing',
    build: (id) => ({ id, label: 'Prezzi', blockType: 'pricing', fields: pricingFields }),
    defaultValues: {
      sectionTitle: 'Prezzi semplici',
      subtext: 'Scegli il piano giusto per te.',
      bgColor: '#ffffff',
      textColor: '#0f172a',
      accentColor: '#3b82f6',
      plans: [
        { name: 'Base',  price: '9€',  period: '/mese', features: 'Funzione 1\nFunzione 2', ctaLabel: 'Scegli' },
        { name: 'Pro',   price: '29€', period: '/mese', features: 'Tutto di Base\nFunzione extra', ctaLabel: 'Scegli' },
        { name: 'Team',  price: '99€', period: '/mese', features: 'Tutto di Pro\nUtenti illimitati', ctaLabel: 'Scegli' },
      ],
    },
  },
  {
    id: 'testimonials-grid',
    label: 'Testimonianze · griglia',
    category: 'social',
    blockType: 'testimonials',
    build: (id) => ({ id, label: 'Testimonianze', blockType: 'testimonials', fields: testimonialsFields }),
    defaultValues: {
      sectionTitle: 'Dicono di noi',
      bgColor: '#f8fafc',
      textColor: '#0f172a',
      items: [
        { quote: '"Esperienza straordinaria."', author: 'Mario Rossi', role: 'CEO' },
        { quote: '"Lo consiglio a tutti."', author: 'Giulia Bianchi', role: 'Designer' },
      ],
    },
  },
  {
    id: 'stats-inline',
    label: 'Statistiche · inline',
    category: 'social',
    blockType: 'stats',
    build: (id) => ({ id, label: 'Statistiche', blockType: 'stats', fields: statsFields }),
    defaultValues: {
      bgColor: '#0f172a',
      textColor: '#f8fafc',
      items: [
        { value: '10k+', label: 'Utenti attivi' },
        { value: '99%',  label: 'Uptime' },
        { value: '24/7', label: 'Supporto' },
      ],
    },
  },
]

/* ─── Field set corretti (allineati alle props dei blocchi) ─── */

const featuresFieldsV2: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Funzionalità' },
  { id: 'accentColor',  type: 'color', label: 'Colore accento', default: '#3b82f6' },
  {
    id: 'items', type: 'repeater', label: 'Funzionalità',
    default: [
      { icon: '⚡', title: 'Veloce', desc: 'Performance eccellente.' },
      { icon: '🎯', title: 'Preciso', desc: 'Risultati accurati.' },
      { icon: '🔒', title: 'Sicuro', desc: 'Dati protetti.' },
    ],
    itemSchema: [
      { id: 'icon',  type: 'emoji', label: 'Icona', default: '✦' },
      { id: 'title', type: 'text',  label: 'Titolo', default: 'Titolo' },
      { id: 'desc',  type: 'text',  label: 'Descrizione', default: 'Descrizione' },
    ],
  },
]

const ctaFieldsV2: Section['fields'] = [
  { id: 'headline',    type: 'text',  label: 'Titolo',     default: 'Pronto a iniziare?' },
  { id: 'subtext',     type: 'text',  label: 'Sottotitolo', default: 'Unisciti a chi ha già scelto.', multiline: true },
  { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA',   default: 'Inizia ora' },
  { id: 'bgColor',     type: 'color', label: 'Sfondo',      default: '#0f172a' },
  { id: 'textColor',   type: 'color', label: 'Testo',       default: '#f8fafc' },
]

const faqFieldsV2: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo', default: 'Domande frequenti' },
  {
    id: 'items', type: 'repeater', label: 'Domande',
    default: [
      { question: 'Come funziona?', answer: 'Risposta chiara e breve.' },
      { question: 'Quanto costa?', answer: 'Risposta chiara e breve.' },
    ],
    itemSchema: [
      { id: 'question', type: 'text', label: 'Domanda', default: 'Domanda?' },
      { id: 'answer',   type: 'text', label: 'Risposta', default: 'Risposta.' },
    ],
  },
]

const pricingFieldsV2: Section['fields'] = [
  { id: 'sectionTitle', type: 'text',  label: 'Titolo',  default: 'Prezzi' },
  { id: 'accentColor',  type: 'color', label: 'Accento', default: '#3b82f6' },
  {
    id: 'plans', type: 'repeater', label: 'Piani',
    default: [
      { name: 'Base', price: '9', period: '/mese', cta: 'Scegli', highlighted: 'false', features: 'Funzione 1|Funzione 2' },
      { name: 'Pro',  price: '29', period: '/mese', cta: 'Scegli', highlighted: 'true',  features: 'Tutto di Base|Funzione extra' },
    ],
    itemSchema: [
      { id: 'name',        type: 'text', label: 'Nome', default: 'Piano' },
      { id: 'price',       type: 'text', label: 'Prezzo (numero)', default: '9' },
      { id: 'period',      type: 'text', label: 'Periodo', default: '/mese' },
      { id: 'cta',         type: 'text', label: 'Testo bottone', default: 'Scegli' },
      { id: 'highlighted', type: 'text', label: 'In evidenza (true/false)', default: 'false' },
      { id: 'features',    type: 'text', label: 'Funzioni (separate da |)', default: '' },
    ],
  },
]

const testimonialsFieldsV2: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo', default: 'Dicono di noi' },
  {
    id: 'items', type: 'repeater', label: 'Testimonianze',
    default: [
      { quote: '"Esperienza straordinaria."', author: 'Mario Rossi', role: 'CEO', avatar: '' },
      { quote: '"Lo consiglio a tutti."', author: 'Giulia Bianchi', role: 'Designer', avatar: '' },
    ],
    itemSchema: [
      { id: 'quote',  type: 'text',  label: 'Citazione', default: '"..."' },
      { id: 'author', type: 'text',  label: 'Autore', default: 'Nome' },
      { id: 'role',   type: 'text',  label: 'Ruolo', default: 'Cliente' },
      { id: 'avatar', type: 'image', label: 'Avatar', default: '' },
    ],
  },
]

const galleryFields: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Galleria' },
  { id: 'layout',       type: 'text', label: 'Layout (masonry/two-col/grid)', default: 'grid' },
  {
    id: 'items', type: 'repeater', label: 'Immagini',
    default: [
      { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', caption: 'Immagine 1' },
      { image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', caption: 'Immagine 2' },
      { image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80', caption: 'Immagine 3' },
    ],
    itemSchema: [
      { id: 'image',   type: 'image', label: 'Immagine', default: '' },
      { id: 'caption', type: 'text',  label: 'Didascalia', default: '' },
    ],
  },
]

const articlesFields: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Dal blog' },
  {
    id: 'items', type: 'repeater', label: 'Articoli',
    default: [
      { title: 'Primo articolo', excerpt: 'Estratto…', date: '1 gennaio 2026', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80', tag: 'News' },
      { title: 'Secondo articolo', excerpt: 'Estratto…', date: '2 gennaio 2026', image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80', tag: 'Guide' },
    ],
    itemSchema: [
      { id: 'title',   type: 'text',  label: 'Titolo', default: 'Titolo' },
      { id: 'excerpt', type: 'text',  label: 'Estratto', default: '' },
      { id: 'date',    type: 'text',  label: 'Data', default: '' },
      { id: 'image',   type: 'image', label: 'Immagine', default: '' },
      { id: 'tag',     type: 'text',  label: 'Tag', default: '' },
    ],
  },
]

const contactFields: Section['fields'] = [
  { id: 'sectionTitle',     type: 'text',  label: 'Titolo', default: 'Contattaci' },
  { id: 'subtext',          type: 'text',  label: 'Sottotitolo', default: 'Ti risponderemo presto.', multiline: true },
  { id: 'submitLabel',      type: 'text',  label: 'Testo bottone', default: 'Invia messaggio' },
  { id: 'emailPlaceholder', type: 'text',  label: 'Placeholder email', default: 'La tua email' },
  { id: 'showName',         type: 'text',  label: 'Campo nome (true/false)', default: 'true' },
  { id: 'showMessage',      type: 'text',  label: 'Campo messaggio (true/false)', default: 'true' },
  { id: 'bgColor',          type: 'color', label: 'Sfondo', default: '#ffffff' },
  { id: 'textColor',        type: 'color', label: 'Testo', default: '#0f172a' },
]

const linklistFields: Section['fields'] = [
  { id: 'name',        type: 'text',  label: 'Nome', default: 'Il tuo nome' },
  { id: 'bio',         type: 'text',  label: 'Bio', default: 'La tua bio in una riga.', multiline: true },
  { id: 'avatar',      type: 'image', label: 'Avatar', default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { id: 'bgColor',     type: 'color', label: 'Sfondo', default: '#0f172a' },
  { id: 'textColor',   type: 'color', label: 'Testo', default: '#ffffff' },
  { id: 'accentColor', type: 'color', label: 'Accento', default: '#3b82f6' },
  {
    id: 'links', type: 'repeater', label: 'Link',
    default: [
      { label: 'Sito web', url: 'https://example.com', emoji: '🌐' },
      { label: 'Instagram', url: 'https://instagram.com', emoji: '📷' },
    ],
    itemSchema: [
      { id: 'label', type: 'text',  label: 'Testo', default: 'Link' },
      { id: 'url',   type: 'text',  label: 'URL', default: 'https://' },
      { id: 'emoji', type: 'emoji', label: 'Emoji', default: '🔗' },
    ],
  },
]

const menuFields: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo', default: 'Il nostro menu' },
  { id: 'subtext',      type: 'text', label: 'Sottotitolo', default: '', multiline: true },
  {
    id: 'groups', type: 'repeater', label: 'Sezioni menu',
    default: [
      { groupName: 'Antipasti', items: 'Bruschetta — 6€\nTagliere — 12€' },
      { groupName: 'Primi', items: 'Pasta fresca — 14€\nRisotto — 16€' },
    ],
    itemSchema: [
      { id: 'groupName', type: 'text', label: 'Nome sezione', default: 'Sezione' },
      { id: 'items',     type: 'text', label: 'Piatti (uno per riga, "Nome — Prezzo")', default: '' },
    ],
  },
]

const productsFields: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'I nostri prodotti' },
  {
    id: 'items', type: 'repeater', label: 'Prodotti',
    default: [
      { image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', name: 'Prodotto uno', price: '49€', tag: '' },
      { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', name: 'Prodotto due', price: '79€', tag: 'Bestseller' },
    ],
    itemSchema: [
      { id: 'image', type: 'image', label: 'Immagine', default: '' },
      { id: 'name',  type: 'text',  label: 'Nome', default: 'Prodotto' },
      { id: 'price', type: 'text',  label: 'Prezzo', default: '0€' },
      { id: 'tag',   type: 'text',  label: 'Tag (es. -30%, New)', default: '' },
    ],
  },
]

const scheduleFields: Section['fields'] = [
  { id: 'sectionTitle', type: 'text', label: 'Titolo', default: 'Programma' },
  { id: 'date',         type: 'text', label: 'Data', default: 'Sabato 12 ottobre' },
  {
    id: 'items', type: 'repeater', label: 'Appuntamenti',
    default: [
      { time: '09:00', title: 'Apertura', speaker: 'Organizzazione', location: 'Hall' },
      { time: '10:30', title: 'Talk principale', speaker: 'Ospite', location: 'Sala A' },
    ],
    itemSchema: [
      { id: 'time',     type: 'text', label: 'Orario', default: '09:00' },
      { id: 'title',    type: 'text', label: 'Titolo', default: 'Titolo' },
      { id: 'speaker',  type: 'text', label: 'Relatore', default: '' },
      { id: 'location', type: 'text', label: 'Luogo', default: '' },
    ],
  },
]

const textblockFields: Section['fields'] = [
  { id: 'eyebrow',   type: 'text', label: 'Occhiello', default: '' },
  { id: 'heading',   type: 'text', label: 'Titolo', default: 'Un titolo importante' },
  { id: 'body',      type: 'text', label: 'Testo', default: 'Un paragrafo ben scritto.', multiline: true },
  { id: 'alignment', type: 'text', label: 'Allineamento (left/center)', default: 'left' },
]

function definePreset(
  id: string,
  label: string,
  category: LayoutPreset['category'],
  blockType: BlockType,
  sectionLabel: string,
  fields: Section['fields'],
  defaultValues: Record<string, unknown>,
): LayoutPreset {
  return {
    id, label, category, blockType,
    build: (uid: string) => ({ id: uid, label: sectionLabel, blockType, fields }),
    defaultValues,
  }
}

/* ─── Batch A · hero / features / about / cta (24 preset) ─── */
const EXTRA_PRESETS_A: LayoutPreset[] = [
  definePreset('hero-centered-badge', 'Hero · centrato con badge', 'hero', 'hero', 'Hero', heroFields, {
    headline: 'Costruisci qualcosa\ndi straordinario.',
    subheadline: 'La piattaforma che ti fa risparmiare ore di lavoro ogni settimana.',
    badge: 'Nuovo · v2 disponibile', ctaLabel: 'Prova gratis', footnote: '',
    bgColor: '#ffffff', textColor: '#0f172a', accentColor: '#7c3aed',
  }),
  definePreset('hero-dark-neon', 'Hero · dark neon', 'hero', 'hero', 'Hero', heroFields, {
    headline: 'Entra nel futuro\ndel tuo settore.',
    subheadline: 'Tecnologia all’avanguardia, design che colpisce, risultati misurabili.',
    badge: '⚡ Early access', ctaLabel: 'Richiedi accesso', footnote: 'Posti limitati',
    bgColor: '#050510', textColor: '#f8fafc', accentColor: '#00e5ff',
  }),
  definePreset('hero-light-clean', 'Hero · chiaro minimale', 'hero', 'hero', 'Hero', heroFields, {
    headline: 'Chiarezza prima\ndi tutto.',
    subheadline: 'Un prodotto semplice per un problema complesso.',
    badge: '', ctaLabel: 'Scopri di più', footnote: '',
    bgColor: '#f8fafc', textColor: '#0f172a', accentColor: '#16a34a',
  }),
  definePreset('hero-app-download', 'Hero · download app', 'hero', 'hero', 'Hero', heroFields, {
    headline: 'La tua app\nsempre con te.',
    subheadline: 'Scarica l’app e porta tutto il tuo mondo in tasca.',
    badge: 'iOS & Android', ctaLabel: 'Scarica ora', footnote: 'Gratis · Nessuna carta richiesta',
    bgColor: '#0f172a', textColor: '#f8fafc', accentColor: '#22d3ee',
  }),
  definePreset('hero-restaurant-warm', 'Hero · ristorante caldo', 'hero', 'hero', 'Hero', heroFields, {
    headline: 'Sapori autentici\ndal 1962.',
    subheadline: 'Cucina di territorio, ingredienti freschi e accoglienza di casa.',
    badge: 'Trattoria · Milano', ctaLabel: 'Prenota un tavolo', footnote: 'Aperti mar – dom',
    bgColor: '#1c0f08', textColor: '#fdf6ec', accentColor: '#d97742',
  }),
  definePreset('hero-portfolio-intro', 'Hero · intro portfolio', 'hero', 'hero', 'Hero', heroFields, {
    headline: 'Ciao, sono Alex.\nDisegno esperienze.',
    subheadline: 'Designer freelance: brand, interfacce e siti che convertono.',
    badge: 'Disponibile per progetti', ctaLabel: 'Vedi i lavori', footnote: '',
    bgColor: '#ffffff', textColor: '#111111', accentColor: '#ff3d3d',
  }),
  definePreset('hero-event-launch', 'Hero · lancio evento', 'hero', 'hero', 'Hero', heroFields, {
    headline: 'Design Week\n12 — 14 giugno.',
    subheadline: 'Tre giorni di talk, workshop e installazioni nel cuore della città.',
    badge: 'Biglietti disponibili', ctaLabel: 'Prendi il biglietto', footnote: 'Early bird fino al 30 aprile',
    bgColor: '#12071f', textColor: '#ffffff', accentColor: '#f59e0b',
  }),
  definePreset('hero-saas-violet', 'Hero · SaaS viola', 'hero', 'hero', 'Hero', heroFields, {
    headline: 'Il CRM che il tuo\nteam amerà.',
    subheadline: 'Pipeline, automazioni e report in un unico posto.',
    badge: '', ctaLabel: 'Inizia la prova', footnote: '14 giorni gratis',
    bgColor: '#1e1b4b', textColor: '#ede9fe', accentColor: '#8b5cf6',
  }),
  definePreset('features-saas-dark', 'Features · SaaS dark', 'features', 'features', 'Funzionalità', featuresFieldsV2, {
    sectionTitle: 'Tutto sotto controllo',
    accentColor: '#22d3ee',
    items: [
      { icon: '📊', title: 'Dashboard live', desc: 'Metriche aggiornate in tempo reale.' },
      { icon: '🤖', title: 'Automazioni', desc: 'Flussi che lavorano per te.' },
      { icon: '🔐', title: 'Sicurezza enterprise', desc: 'SSO, audit log e backup.' },
    ],
  }),
  definePreset('features-restaurant', 'Features · ristorante', 'features', 'features', 'Perché noi', featuresFieldsV2, {
    sectionTitle: 'Perché sceglierci',
    accentColor: '#d97742',
    items: [
      { icon: '🌾', title: 'Ingredienti locali', desc: 'Filiera corta e stagionalità.' },
      { icon: '👨‍🍳', title: 'Chef stellato', desc: 'Esperienza ventennale.' },
      { icon: '🍷', title: 'Cantina selezionata', desc: 'Oltre 200 etichette.' },
    ],
  }),
  definePreset('features-fitness', 'Features · fitness', 'features', 'features', 'Programmi', featuresFieldsV2, {
    sectionTitle: 'Allenati a modo tuo',
    accentColor: '#84cc16',
    items: [
      { icon: '💪', title: 'Schede personalizzate', desc: 'Piani su misura per te.' },
      { icon: '📱', title: 'App dedicata', desc: 'Traccia ogni progresso.' },
      { icon: '🥗', title: 'Piano alimentare', desc: 'Nutrizione senza rinunce.' },
    ],
  }),
  definePreset('features-shop-perks', 'Features · vantaggi shop', 'features', 'features', 'Vantaggi', featuresFieldsV2, {
    sectionTitle: 'Acquista senza pensieri',
    accentColor: '#f43f5e',
    items: [
      { icon: '🚚', title: 'Spedizione gratis', desc: 'Sopra i 50€ in 48h.' },
      { icon: '↩️', title: 'Resi 30 giorni', desc: 'Soddisfatti o rimborsati.' },
      { icon: '💳', title: 'Pagamenti sicuri', desc: 'Carte, PayPal e contrassegno.' },
    ],
  }),
  definePreset('features-agency', 'Features · servizi studio', 'features', 'features', 'Servizi', featuresFieldsV2, {
    sectionTitle: 'Cosa facciamo',
    accentColor: '#8b5cf6',
    items: [
      { icon: '🎨', title: 'Brand identity', desc: 'Loghi che restano in testa.' },
      { icon: '💻', title: 'Siti web', desc: 'Veloci, belli, che vendono.' },
      { icon: '📣', title: 'Social & ADV', desc: 'Campagne che convertono.' },
    ],
  }),
  definePreset('features-checklist', 'Features · checklist', 'features', 'features', 'Incluso', featuresFieldsV2, {
    sectionTitle: 'Tutto incluso',
    accentColor: '#16a34a',
    items: [
      { icon: '✅', title: 'Setup iniziale', desc: 'Configurazione guidata.' },
      { icon: '✅', title: 'Migrazione dati', desc: 'Portiamo tutto noi.' },
      { icon: '✅', title: 'Formazione team', desc: 'Video + sessione live.' },
    ],
  }),
  definePreset('about-team', 'About · il team', 'content', 'about', 'Chi siamo', aboutFields, {
    eyebrow: 'Il team', headline: 'Persone prima dei processi',
    body: 'Siamo un team distribuito di designer, sviluppatori e strateghi. Lavoriamo con pochi clienti alla volta, per dare a ciascuno il massimo.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    bgColor: '#ffffff', textColor: '#0f172a',
  }),
  definePreset('about-mission-dark', 'About · mission dark', 'content', 'about', 'Missione', aboutFields, {
    eyebrow: 'La nostra missione', headline: 'Rendere il web più veloce',
    body: 'Crediamo che ogni millisecondo conti. Per questo costruiamo esperienze leggere, accessibili e belle da usare.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    bgColor: '#0f172a', textColor: '#f8fafc',
  }),
  definePreset('about-founder', 'About · il fondatore', 'content', 'about', 'Fondatore', aboutFields, {
    eyebrow: 'Fondatore', headline: 'Ho iniziato in garage',
    body: 'Quindici anni fa riparavo computer nel garage di mio padre. Oggi aiuto centinaia di aziende a crescere online.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bgColor: '#f8fafc', textColor: '#0f172a',
  }),
  definePreset('about-craft', 'About · artigianato', 'content', 'about', 'Artigianato', aboutFields, {
    eyebrow: 'Bottega', headline: 'Fatto a mano, ogni giorno',
    body: 'Ogni pezzo nasce dalle nostre mani: scegliamo i materiali, curiamo i dettagli, firmiamo il risultato.',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80',
    bgColor: '#faf5ec', textColor: '#3f2d1e',
  }),
  definePreset('cta-dark-glow', 'CTA · dark glow', 'utility', 'cta', 'Call to Action', ctaFieldsV2, {
    headline: 'Il futuro inizia oggi', subtext: 'Unisciti a 10.000+ persone che hanno già fatto il salto.',
    ctaLabel: 'Comincia gratis', bgColor: '#070714', textColor: '#ffffff',
  }),
  definePreset('cta-accent-bold', 'CTA · accento pieno', 'utility', 'cta', 'Call to Action', ctaFieldsV2, {
    headline: 'Pronto a decollare?', subtext: 'Nessuna carta richiesta. Disdici quando vuoi.',
    ctaLabel: 'Attiva ora', bgColor: '#7c3aed', textColor: '#ffffff',
  }),
  definePreset('cta-light-soft', 'CTA · chiara soft', 'utility', 'cta', 'Call to Action', ctaFieldsV2, {
    headline: 'Parliamone davanti a un caffè', subtext: 'Raccontaci il tuo progetto: ti risponderemo entro 24 ore.',
    ctaLabel: 'Prenota una call', bgColor: '#f1f5f9', textColor: '#0f172a',
  }),
  definePreset('cta-sale-flash', 'CTA · offerta lampo', 'utility', 'cta', 'Call to Action', ctaFieldsV2, {
    headline: '-40% solo fino a domenica', subtext: 'Su tutti i piani annuali. Il prezzo più basso dell’anno.',
    ctaLabel: 'Approfitta ora', bgColor: '#7f1d1d', textColor: '#fef2f2',
  }),
  definePreset('cta-newsletter', 'CTA · newsletter', 'utility', 'cta', 'Call to Action', ctaFieldsV2, {
    headline: 'Una email al mese. Solo cose utili.', subtext: 'Niente spam: idee, casi studio e risorse gratuite.',
    ctaLabel: 'Iscriviti', bgColor: '#0c2b2e', textColor: '#d9f6f3',
  }),
  definePreset('cta-event-tickets', 'CTA · biglietti evento', 'utility', 'cta', 'Call to Action', ctaFieldsV2, {
    headline: 'Ultimi 50 biglietti', subtext: 'L’edizione scorsa ha fatto sold out in 6 giorni.',
    ctaLabel: 'Acquista il biglietto', bgColor: '#231303', textColor: '#fef3c7',
  }),
]

/* ─── Batch B · faq / pricing / testimonianze / stats / gallery (23 preset) ─── */
const EXTRA_PRESETS_B: LayoutPreset[] = [
  definePreset('faq-saas', 'FAQ · SaaS', 'content', 'faq', 'FAQ', faqFieldsV2, {
    sectionTitle: 'Domande frequenti',
    items: [
      { question: 'Serve la carta di credito per la prova?', answer: 'No: 14 giorni gratis, senza carta.' },
      { question: 'Posso cambiare piano in seguito?', answer: 'Sì, upgrade e downgrade in un click.' },
      { question: 'I miei dati sono al sicuro?', answer: 'Crittografia AES-256 e backup giornalieri.' },
    ],
  }),
  definePreset('faq-ecommerce', 'FAQ · spedizioni e resi', 'content', 'faq', 'FAQ', faqFieldsV2, {
    sectionTitle: 'Spedizioni e resi',
    items: [
      { question: 'Quanto costa la spedizione?', answer: 'Gratis sopra i 50€, altrimenti 4,90€.' },
      { question: 'In quanto tempo arriva?', answer: '24/48h in Italia, 3-5 giorni in Europa.' },
      { question: 'Come faccio un reso?', answer: 'Hai 30 giorni: etichetta prepagata inclusa.' },
    ],
  }),
  definePreset('faq-restaurant', 'FAQ · ristorante', 'content', 'faq', 'FAQ', faqFieldsV2, {
    sectionTitle: 'Buono a sapersi',
    items: [
      { question: 'Serve prenotare?', answer: 'Consigliato nel weekend, a pranzo quasi sempre posto.' },
      { question: 'Avete opzioni vegetariane?', answer: 'Sì, e su richiesta anche vegane e senza glutine.' },
      { question: 'Accettate animali?', answer: 'Sì, in veranda e in sala piccola.' },
    ],
  }),
  definePreset('faq-events', 'FAQ · eventi', 'content', 'faq', 'FAQ', faqFieldsV2, {
    sectionTitle: 'Info utili',
    items: [
      { question: 'Il biglietto è rimborsabile?', answer: 'Sì fino a 7 giorni prima dell’evento.' },
      { question: 'Posso cedere il mio posto?', answer: 'Sì: il cambio nominativo è gratuito.' },
      { question: 'L’evento è accessibile?', answer: 'Sì, tutti gli spazi sono senza barriere.' },
    ],
  }),
  definePreset('faq-support', 'FAQ · supporto', 'content', 'faq', 'FAQ', faqFieldsV2, {
    sectionTitle: 'Hai bisogno di aiuto?',
    items: [
      { question: 'Come vi contatto?', answer: 'Chat in-app, email o telefono dal lunedì al venerdì.' },
      { question: 'Tempi di risposta?', answer: 'Mediamente sotto le 2 ore lavorative.' },
      { question: 'Avete una knowledge base?', answer: 'Sì: guide, video e API docs sempre aggiornate.' },
    ],
  }),
  definePreset('pricing-saas-pro', 'Pricing · SaaS Pro', 'commerce', 'pricing', 'Prezzi', pricingFieldsV2, {
    sectionTitle: 'Piani semplici, senza sorprese',
    accentColor: '#3b82f6',
    plans: [
      { name: 'Starter', price: '0', period: '/sempre', cta: 'Inizia gratis', highlighted: 'false', features: '1 progetto|1GB storage|Supporto community' },
      { name: 'Pro', price: '29', period: '/mese', cta: 'Prova 14 giorni', highlighted: 'true', features: 'Progetti illimitati|100GB storage|Automazioni|Supporto prioritario' },
      { name: 'Scale', price: '99', period: '/mese', cta: 'Contattaci', highlighted: 'false', features: 'Tutto di Pro|SSO & audit log|Manager dedicato' },
    ],
  }),
  definePreset('pricing-freemium', 'Pricing · freemium', 'commerce', 'pricing', 'Prezzi', pricingFieldsV2, {
    sectionTitle: 'Inizia gratis, cresci quando vuoi',
    accentColor: '#16a34a',
    plans: [
      { name: 'Free', price: '0', period: '/sempre', cta: 'Crea account', highlighted: 'true', features: 'Funzioni base|Community|1 progetto' },
      { name: 'Plus', price: '12', period: '/mese', cta: 'Passa a Plus', highlighted: 'false', features: 'Tutto Free|10 progetti|Export HD' },
    ],
  }),
  definePreset('pricing-annual', 'Pricing · annuale', 'commerce', 'pricing', 'Prezzi', pricingFieldsV2, {
    sectionTitle: 'Risparmia con l’annuale',
    accentColor: '#7c3aed',
    plans: [
      { name: 'Mensile', price: '19', period: '/mese', cta: 'Scegli mensile', highlighted: 'false', features: 'Tutte le funzioni|Disdici quando vuoi' },
      { name: 'Annuale', price: '15', period: '/mese', cta: 'Risparmia il 20%', highlighted: 'true', features: 'Tutte le funzioni|2 mesi gratis|Onboarding dedicato' },
    ],
  }),
  definePreset('pricing-services', 'Pricing · servizi', 'commerce', 'pricing', 'Prezzi', pricingFieldsV2, {
    sectionTitle: 'Pacchetti chiari',
    accentColor: '#d97742',
    plans: [
      { name: 'Essenziale', price: '490', period: '/una tantum', cta: 'Richiedi', highlighted: 'false', features: 'Analisi iniziale|Consegna in 7 giorni|1 revisione' },
      { name: 'Completo', price: '1290', period: '/una tantum', cta: 'Richiedi', highlighted: 'true', features: 'Tutto Essenziale|Strategia completa|3 revisioni|30gg supporto' },
      { name: 'Su misura', price: '—', period: '', cta: 'Parliamone', highlighted: 'false', features: 'Scope personalizzato|Team dedicato' },
    ],
  }),
  definePreset('pricing-studio', 'Pricing · abbonamenti studio', 'commerce', 'pricing', 'Prezzi', pricingFieldsV2, {
    sectionTitle: 'Abbonamenti per risultati continui',
    accentColor: '#0f172a',
    plans: [
      { name: 'Sprint', price: '900', period: '/mese', cta: 'Parti', highlighted: 'false', features: '1 richiesta attiva|Consegne settimanali|Pausa quando vuoi' },
      { name: 'Growth', price: '1900', period: '/mese', cta: 'Scala', highlighted: 'true', features: '3 richieste attive|Designer + stratega|Call settimanale' },
    ],
  }),
  definePreset('testimonials-saas', 'Testimonianze · SaaS', 'social', 'testimonials', 'Testimonianze', testimonialsFieldsV2, {
    sectionTitle: 'Amato dai team di prodotto',
    items: [
      { quote: '"Abbiamo dimezzato i tempi di rilascio in un trimestre."', author: 'Marco Ferri', role: 'CTO @ Nexa', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
      { quote: '"Il supporto migliore che abbia mai provato."', author: 'Elena Riva', role: 'Head of Design @ Lumen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
      { quote: '"ROI visibile dal primo mese."', author: 'Davide Sala', role: 'Founder @ Kube', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
    ],
  }),
  definePreset('testimonials-food', 'Testimonianze · food', 'social', 'testimonials', 'Testimonianze', testimonialsFieldsV2, {
    sectionTitle: 'I nostri ospiti',
    items: [
      { quote: '"La carbonara migliore fuori Roma."', author: 'Chiara', role: 'Cliente abituale', avatar: '' },
      { quote: '"Servizio impeccabile, torneremo."', author: 'Famiglia Colombo', role: 'Ospiti', avatar: '' },
    ],
  }),
  definePreset('testimonials-course', 'Testimonianze · corso', 'social', 'testimonials', 'Testimonianze', testimonialsFieldsV2, {
    sectionTitle: 'Storie di successo',
    items: [
      { quote: '"Ho trovato lavoro prima di finire il corso."', author: 'Sara', role: 'Ex studentessa, ora UX designer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
      { quote: '"Lezioni pratiche, zero fuffa."', author: 'Luca', role: 'Studente cohort 12', avatar: '' },
    ],
  }),
  definePreset('testimonials-agency', 'Testimonianze · clienti', 'social', 'testimonials', 'Testimonianze', testimonialsFieldsV2, {
    sectionTitle: 'Clienti che restano',
    items: [
      { quote: '"+180% di lead in sei mesi."', author: 'Paola Neri', role: 'Marketing Director', avatar: '' },
      { quote: '"Un’estensione del nostro team."', author: 'Giorgio Blu', role: 'CEO', avatar: '' },
      { quote: '"Precisi, veloci, creativi."', author: 'Anna Verdi', role: 'Founder', avatar: '' },
    ],
  }),
  definePreset('testimonials-minimal', 'Testimonianze · minimal', 'social', 'testimonials', 'Testimonianze', testimonialsFieldsV2, {
    sectionTitle: 'Dicono di noi',
    items: [
      { quote: '"Semplicemente perfetto."', author: '— Marta', role: '', avatar: '' },
      { quote: '"Non posso più farne a meno."', author: '— Federico', role: '', avatar: '' },
    ],
  }),
  definePreset('stats-growth', 'Statistiche · crescita', 'social', 'stats', 'Statistiche', statsFields, {
    bgColor: '#0f172a', textColor: '#f8fafc',
    items: [
      { value: '40k+', label: 'Utenti attivi' },
      { value: '4.9★', label: 'Rating medio' },
      { value: '120+', label: 'Paesi' },
    ],
  }),
  definePreset('stats-light', 'Statistiche · chiare', 'social', 'stats', 'Statistiche', statsFields, {
    bgColor: '#f8fafc', textColor: '#0f172a',
    items: [
      { value: '15', label: 'Anni di esperienza' },
      { value: '300+', label: 'Progetti consegnati' },
      { value: '98%', label: 'Clienti soddisfatti' },
    ],
  }),
  definePreset('stats-restaurant', 'Statistiche · ristorante', 'social', 'stats', 'Statistiche', statsFields, {
    bgColor: '#1c0f08', textColor: '#fdf6ec',
    items: [
      { value: '60+', label: 'Anni di storia' },
      { value: '25', label: 'Piatti in carta' },
      { value: '200', label: 'Vini in cantina' },
    ],
  }),
  definePreset('stats-portfolio', 'Statistiche · portfolio', 'social', 'stats', 'Statistiche', statsFields, {
    bgColor: '#111111', textColor: '#ffffff',
    items: [
      { value: '80+', label: 'Progetti' },
      { value: '12', label: 'Premi vinti' },
      { value: '9', label: 'Anni di attività' },
    ],
  }),
  definePreset('gallery-masonry', 'Galleria · masonry', 'content', 'gallery', 'Galleria', galleryFields, {
    sectionTitle: 'Lavori selezionati', layout: 'masonry',
    items: [
      { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', caption: 'Vette — 2025' },
      { image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', caption: 'Alba — 2024' },
      { image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80', caption: 'Bosco — 2024' },
      { image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80', caption: 'Cascata — 2023' },
    ],
  }),
  definePreset('gallery-two-col', 'Galleria · due colonne', 'content', 'gallery', 'Galleria', galleryFields, {
    sectionTitle: 'Progetti recenti', layout: 'two-col',
    items: [
      { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', caption: 'Ufficio — Cliente A' },
      { image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80', caption: 'Studio — Cliente B' },
    ],
  }),
  definePreset('gallery-grid', 'Galleria · griglia', 'content', 'gallery', 'Galleria', galleryFields, {
    sectionTitle: 'Portfolio', layout: 'grid',
    items: [
      { image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', caption: 'Hardware' },
      { image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', caption: 'Software' },
      { image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80', caption: 'Team' },
    ],
  }),
  definePreset('gallery-food', 'Galleria · food', 'content', 'gallery', 'Galleria', galleryFields, {
    sectionTitle: 'Dalla nostra cucina', layout: 'masonry',
    items: [
      { image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', caption: 'Piatto del giorno' },
      { image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', caption: 'La sala' },
      { image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', caption: 'I nostri tavoli' },
    ],
  }),
]

/* ─── Batch C · articles / contact / linklist / menu / products / schedule / textblock (23 preset) ─── */
const EXTRA_PRESETS_C: LayoutPreset[] = [
  definePreset('articles-editorial', 'Articoli · editoriale', 'content', 'articles', 'Articoli', articlesFields, {
    sectionTitle: 'Storie in evidenza',
    items: [
      { title: 'Come abbiamo ridisegnato tutto in 30 giorni', excerpt: 'Il dietro le quinte di un rebrand completo, tra notti insonni e grandi scoperte.', date: '4 settembre 2026', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80', tag: 'Design' },
      { title: '10 lezioni da 10 anni di freelance', excerpt: 'Quello che nessuno ti dice sul lavoro autonomo.', date: '28 agosto 2026', image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80', tag: 'Carriera' },
      { title: 'Il futuro dei design system', excerpt: 'Token, varianti e automazione: dove stiamo andando.', date: '20 agosto 2026', image: 'https://images.unsplash.com/photo-1461749280684-d3baade3aede?w=800&q=80', tag: 'Trend' },
    ],
  }),
  definePreset('articles-tech', 'Articoli · tech', 'content', 'articles', 'Articoli', articlesFields, {
    sectionTitle: 'Dal changelog',
    items: [
      { title: 'Release 2.0: automazioni', excerpt: 'La novità più richiesta è finalmente qui.', date: '1 settembre 2026', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', tag: 'Release' },
      { title: 'Come scaliamo a 1M di utenti', excerpt: 'Architettura, cache e lezioni imparate.', date: '25 agosto 2026', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80', tag: 'Engineering' },
    ],
  }),
  definePreset('articles-recipes', 'Articoli · ricette', 'content', 'articles', 'Articoli', articlesFields, {
    sectionTitle: 'Ricette della settimana',
    items: [
      { title: 'Risotto alla milanese perfetto', excerpt: 'Mantecatura, tostatura e il segreto dello zafferano.', date: '6 settembre 2026', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', tag: 'Primi' },
      { title: 'Pane fatto in casa', excerpt: 'Solo farina, acqua, sale e pazienza.', date: '30 agosto 2026', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', tag: 'Lievitati' },
      { title: 'Tiramisù della nonna', excerpt: 'La ricetta originale, senza scorciatoie.', date: '22 agosto 2026', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80', tag: 'Dolci' },
    ],
  }),
  definePreset('contact-minimal', 'Contatti · minimale', 'utility', 'contact', 'Contatti', contactFields, {
    sectionTitle: 'Resta in contatto', subtext: 'Lascia la tua email: ti scriveremo noi.',
    submitLabel: 'Iscriviti', emailPlaceholder: 'nome@email.it',
    showName: 'false', showMessage: 'false', bgColor: '#ffffff', textColor: '#0f172a',
  }),
  definePreset('contact-complete', 'Contatti · completo', 'utility', 'contact', 'Contatti', contactFields, {
    sectionTitle: 'Parliamone', subtext: 'Raccontaci il tuo progetto: rispondiamo entro 24 ore.',
    submitLabel: 'Invia messaggio', emailPlaceholder: 'La tua email',
    showName: 'true', showMessage: 'true', bgColor: '#f8fafc', textColor: '#0f172a',
  }),
  definePreset('contact-booking', 'Contatti · prenotazioni', 'utility', 'contact', 'Contatti', contactFields, {
    sectionTitle: 'Prenota un tavolo', subtext: 'Per gruppi oltre 8 persone ti ricontattiamo per conferma.',
    submitLabel: 'Richiedi prenotazione', emailPlaceholder: 'La tua email',
    showName: 'true', showMessage: 'true', bgColor: '#1c0f08', textColor: '#fdf6ec',
  }),
  definePreset('contact-support', 'Contatti · supporto', 'utility', 'contact', 'Contatti', contactFields, {
    sectionTitle: 'Serve aiuto?', subtext: 'Descrivi il problema: il team di supporto ti risponderà a breve.',
    submitLabel: 'Apri ticket', emailPlaceholder: 'Email account',
    showName: 'true', showMessage: 'true', bgColor: '#0f172a', textColor: '#f8fafc',
  }),
  definePreset('linklist-creator', 'Link · creator', 'social', 'linklist', 'Link', linklistFields, {
    name: 'Giulia Crea', bio: 'Video maker · 200k follower · Nuovi video ogni martedì',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    bgColor: '#1a0b2e', textColor: '#ffffff', accentColor: '#ff2ea6',
    links: [
      { label: 'Ultimo video 🎬', url: 'https://youtube.com', emoji: '🎬' },
      { label: 'Instagram', url: 'https://instagram.com', emoji: '📷' },
      { label: 'TikTok', url: 'https://tiktok.com', emoji: '🎵' },
      { label: 'Collab & PR', url: 'mailto:ciao@example.com', emoji: '💼' },
    ],
  }),
  definePreset('linklist-minimal', 'Link · minimale', 'social', 'linklist', 'Link', linklistFields, {
    name: 'Marco Neri', bio: 'Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bgColor: '#ffffff', textColor: '#111111', accentColor: '#111111',
    links: [
      { label: 'Portfolio', url: 'https://example.com', emoji: '' },
      { label: 'Email', url: 'mailto:ciao@example.com', emoji: '' },
    ],
  }),
  definePreset('linklist-business', 'Link · business', 'social', 'linklist', 'Link', linklistFields, {
    name: 'Studio Blu', bio: 'Consulenza strategica · Milano · Dal 2009',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    bgColor: '#0f172a', textColor: '#f8fafc', accentColor: '#3b82f6',
    links: [
      { label: 'Prenota una call', url: 'https://example.com/call', emoji: '📅' },
      { label: 'Case study', url: 'https://example.com/casi', emoji: '📊' },
      { label: 'LinkedIn', url: 'https://linkedin.com', emoji: '💼' },
    ],
  }),
  definePreset('menu-ristorante', 'Menu · ristorante', 'commerce', 'menu', 'Menu', menuFields, {
    sectionTitle: 'Il nostro menu', subtext: 'Ingredienti di stagione, tutto fatto in casa.',
    groups: [
      { groupName: 'Antipasti', items: 'Bruschetta al pomodoro — 6€\nTagliere misto — 14€\nBurrata e prosciutto — 12€' },
      { groupName: 'Primi', items: 'Tagliatelle al ragù — 14€\nRisotto ai funghi — 16€\nGnocchi al gorgonzola — 13€' },
      { groupName: 'Secondi', items: 'Tagliata di manzo — 22€\nBranzino al forno — 20€\nParmigiana — 12€' },
      { groupName: 'Dolci', items: 'Tiramisù — 6€\nPanna cotta — 5€\nTorta del giorno — 6€' },
    ],
  }),
  definePreset('menu-cafe', 'Menu · caffetteria', 'commerce', 'menu', 'Menu', menuFields, {
    sectionTitle: 'Caffetteria', subtext: 'Colazioni, brunch e merende.',
    groups: [
      { groupName: 'Caffetteria', items: 'Espresso — 1,20€\nCappuccino — 1,80€\nLatte macchiato — 2€\nCioccolata calda — 3,50€' },
      { groupName: 'Dolci', items: 'Cornetto — 1,50€\nCheesecake — 4,50€\nBrownie — 3,50€' },
    ],
  }),
  definePreset('menu-pizzeria', 'Menu · pizzeria', 'commerce', 'menu', 'Menu', menuFields, {
    sectionTitle: 'Le nostre pizze', subtext: 'Lievitazione 48h, forno a legna.',
    groups: [
      { groupName: 'Classiche', items: 'Margherita — 6€\nMarinara — 5,50€\nDiavola — 8€\nCapricciosa — 8,50€' },
      { groupName: 'Speciali', items: 'Bufalina DOP — 10€\nTartufo e fior di latte — 12€\nOrtolana — 9€' },
    ],
  }),
  definePreset('products-bestseller', 'Prodotti · bestseller', 'commerce', 'products', 'Prodotti', productsFields, {
    sectionTitle: 'I più amati',
    items: [
      { image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', name: 'Orologio Classic', price: '129€', tag: 'Bestseller' },
      { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', name: 'Cuffie Studio', price: '89€', tag: '' },
      { image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', name: 'Sneakers Run', price: '119€', tag: 'New' },
      { image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80', name: 'Sneakers White', price: '99€', tag: '' },
    ],
  }),
  definePreset('products-sale', 'Prodotti · saldi', 'commerce', 'products', 'Prodotti', productsFields, {
    sectionTitle: 'Saldi fino al -50%',
    items: [
      { image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', name: 'Orologio Classic', price: '89€', tag: '-30%' },
      { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', name: 'Cuffie Studio', price: '59€', tag: '-35%' },
    ],
  }),
  definePreset('products-capsule', 'Prodotti · capsule', 'commerce', 'products', 'Prodotti', productsFields, {
    sectionTitle: 'Capsule · edizione limitata',
    items: [
      { image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', name: 'Runner LTD', price: '149€', tag: 'LTD' },
      { image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80', name: 'Court LTD', price: '139€', tag: 'LTD' },
      { image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80', name: 'Air Classic', price: '159€', tag: 'Last pairs' },
    ],
  }),
  definePreset('schedule-conference', 'Programma · conferenza', 'content', 'schedule', 'Programma', scheduleFields, {
    sectionTitle: 'Agenda della giornata', date: 'Venerdì 14 novembre · Milano',
    items: [
      { time: '09:00', title: 'Registrazione e caffè', speaker: '', location: 'Foyer' },
      { time: '10:00', title: 'Keynote di apertura', speaker: 'Ospite speciale', location: 'Main stage' },
      { time: '11:30', title: 'Panel: il futuro del settore', speaker: '4 relatori', location: 'Main stage' },
      { time: '13:00', title: 'Pranzo di networking', speaker: '', location: 'Terrazza' },
      { time: '15:00', title: 'Workshop pratici', speaker: 'Vari', location: 'Sale 1-3' },
    ],
  }),
  definePreset('schedule-workshop', 'Programma · workshop', 'content', 'schedule', 'Programma', scheduleFields, {
    sectionTitle: 'Il workshop', date: 'Sabato · 10:00 – 17:00',
    items: [
      { time: '10:00', title: 'Accoglienza e obiettivi', speaker: 'Il docente', location: 'Aula' },
      { time: '11:00', title: 'Sessione pratica I', speaker: '', location: 'Aula' },
      { time: '14:00', title: 'Sessione pratica II', speaker: '', location: 'Aula' },
      { time: '16:00', title: 'Review e feedback', speaker: '', location: 'Aula' },
    ],
  }),
  definePreset('schedule-festival', 'Programma · festival', 'content', 'schedule', 'Programma', scheduleFields, {
    sectionTitle: 'Line-up', date: '3 giorni · Parco Nord',
    items: [
      { time: '18:00', title: 'Apertura cancelli', speaker: '', location: 'Ingresso' },
      { time: '19:30', title: 'Band emergenti', speaker: 'Palco secondario', location: '' },
      { time: '21:30', title: 'Headliner', speaker: 'Main stage', location: '' },
      { time: '23:30', title: 'DJ set di chiusura', speaker: 'Main stage', location: '' },
    ],
  }),
  definePreset('textblock-manifesto', 'Testo · manifesto', 'content', 'textblock', 'Testo', textblockFields, {
    eyebrow: 'Manifesto', heading: 'Crediamo nelle cose fatte bene.',
    body: 'Niente scorciatoie, niente compromessi: solo lavoro onesto, materiali veri e attenzione ai dettagli. È più lento, ma dura per sempre.',
    alignment: 'center',
  }),
  definePreset('textblock-story', 'Testo · racconto', 'content', 'textblock', 'Testo', textblockFields, {
    eyebrow: 'La nostra storia', heading: 'Tutto è iniziato nel 1987',
    body: 'Da una piccola bottega a un punto di riferimento: tre generazioni, la stessa passione. Ogni giorno la stessa domanda: come farlo meglio di ieri?',
    alignment: 'left',
  }),
  definePreset('textblock-quote', 'Testo · citazione', 'content', 'textblock', 'Testo', textblockFields, {
    eyebrow: '', heading: '“Il design è l’ambasciatore silenzioso del tuo brand.”',
    body: '— Paul Rand',
    alignment: 'center',
  }),
  definePreset('textblock-mission', 'Testo · mission', 'content', 'textblock', 'Testo', textblockFields, {
    eyebrow: 'Mission', heading: 'Accessibile a tutti, senza eccezioni',
    body: 'Progettiamo ogni esperienza perché possa usarla chiunque: ogni abilità, ogni dispositivo, ogni connessione.',
    alignment: 'left',
  }),
]

LAYOUT_PRESETS.push(...EXTRA_PRESETS_A, ...EXTRA_PRESETS_B, ...EXTRA_PRESETS_C)

export function getPreset(id: string): LayoutPreset | undefined {
  return LAYOUT_PRESETS.find((p) => p.id === id)
}
