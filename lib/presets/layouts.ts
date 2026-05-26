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
  { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA',         default: 'Inizia' },
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
      { id: 'quote',  type: 'text', label: 'Citazione', default: '"..."', multiline: true },
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

export function getPreset(id: string): LayoutPreset | undefined {
  return LAYOUT_PRESETS.find((p) => p.id === id)
}
