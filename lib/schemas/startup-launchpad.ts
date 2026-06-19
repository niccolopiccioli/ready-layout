import type { TemplateSchema } from './types'

export const startupLaunchpadSchema: TemplateSchema = {
  id: 'startup-launchpad',
  name: 'Startup Launchpad',
  description: 'Landing page per SaaS, app o prodotto digitale. Hero impattante, features, pricing, FAQ.',
  category: 'landing',
  sections: [
    {
      id: 'hero',
      label: 'Hero',
      blockType: 'hero',
      fields: [
        { id: 'headline',    type: 'text',  label: 'Titolo principale', default: 'Il tuo prodotto\ncambia tutto.' },
        { id: 'subheadline', type: 'text',  label: 'Sottotitolo',       default: 'Costruito per team moderni. Veloce, semplice, potente.', multiline: true },
        { id: 'badge',       type: 'text',  label: 'Etichetta',         default: 'Nuovo ✦ Appena lanciato' },
        { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA',         default: 'Inizia gratis →' },
        { id: 'footnote',    type: 'text',  label: 'Nota sotto CTA',    default: 'Nessuna carta di credito richiesta' },
        { id: 'bgColor',     type: 'color', label: 'Sfondo',            default: '#0f172a' },
        { id: 'textColor',   type: 'color', label: 'Testo',             default: '#f8fafc' },
        { id: 'accentColor', type: 'color', label: 'Colore accento',    default: '#6366f1' },
      ],
    },
    {
      id: 'features',
      label: 'Features',
      blockType: 'features',
      fields: [
        { id: 'sectionTitle', type: 'text',  label: 'Titolo sezione',  default: 'Tutto quello che ti serve' },
        { id: 'accentColor',  type: 'color', label: 'Colore accento',  default: '#6366f1' },
        {
          id: 'items',
          type: 'repeater',
          label: 'Feature items',
          default: [
            { icon: '⚡', title: 'Ultrarapido',       desc: 'Carica in meno di un secondo ovunque.' },
            { icon: '🔒', title: 'Sicuro by default', desc: 'Crittografia end-to-end senza configurazioni.' },
            { icon: '🎨', title: 'Personalizzabile',  desc: 'Adattalo al tuo brand in pochi click.' },
          ],
          itemSchema: [
            { id: 'icon',  type: 'emoji', label: 'Icona',        default: '✨' },
            { id: 'title', type: 'text',  label: 'Titolo',       default: 'Feature' },
            { id: 'desc',  type: 'text',  label: 'Descrizione',  default: 'Descrizione della feature.' },
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Pricing',
      blockType: 'pricing',
      fields: [
        { id: 'sectionTitle', type: 'text',  label: 'Titolo sezione', default: 'Piani semplici, nessuna sorpresa' },
        { id: 'accentColor',  type: 'color', label: 'Colore accento', default: '#6366f1' },
        {
          id: 'plans',
          type: 'repeater',
          label: 'Piani',
          default: [
            { name: 'Starter', price: '0',  period: '/mese', cta: 'Inizia gratis',   highlighted: 'false', features: 'Fino a 3 progetti|10 GB storage|Supporto community' },
            { name: 'Pro',     price: '29', period: '/mese', cta: 'Prova 14 giorni', highlighted: 'true',  features: 'Progetti illimitati|100 GB storage|Supporto prioritario|Analytics avanzate' },
            { name: 'Team',    price: '79', period: '/mese', cta: 'Contattaci',       highlighted: 'false', features: 'Tutto di Pro|Team illimitati|SSO|SLA garantito' },
          ],
          itemSchema: [
            { id: 'name',        type: 'text',  label: 'Nome piano',   default: 'Piano' },
            { id: 'price',       type: 'text',  label: 'Prezzo (€)',    default: '0' },
            { id: 'period',      type: 'text',  label: 'Periodo',       default: '/mese' },
            { id: 'cta',         type: 'text',  label: 'Testo bottone', default: 'Scegli' },
            { id: 'highlighted', type: 'text',  label: 'In evidenza (true/false)', default: 'false' },
            { id: 'features',    type: 'text',  label: 'Feature (separare con |)',  default: 'Feature 1|Feature 2' },
          ],
        },
      ],
    },
    {
      id: 'faq',
      label: 'FAQ',
      blockType: 'faq',
      fields: [
        { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Domande frequenti' },
        {
          id: 'items',
          type: 'repeater',
          label: 'Domande',
          default: [
            { question: 'Posso cancellare in qualsiasi momento?',         answer: 'Sì, puoi cancellare il tuo piano in qualsiasi momento senza penali.' },
            { question: 'È disponibile una versione di prova?',            answer: 'Offriamo 14 giorni di prova gratuita su tutti i piani a pagamento.' },
            { question: "Supportate l'integrazione con altri strumenti?",  answer: 'Sì, offriamo oltre 50 integrazioni native con i principali strumenti.' },
          ],
          itemSchema: [
            { id: 'question', type: 'text', label: 'Domanda', default: 'La tua domanda?' },
            { id: 'answer',   type: 'text', label: 'Risposta', default: 'La risposta qui.' },
          ],
        },
      ],
    },
    {
      id: 'cta',
      label: 'CTA Finale',
      blockType: 'cta',
      fields: [
        { id: 'headline',  type: 'text',  label: 'Titolo',        default: 'Pronto a iniziare?' },
        { id: 'subtext',   type: 'text',  label: 'Testo',         default: 'Unisciti a oltre 10.000 team che usano il nostro prodotto ogni giorno.' },
        { id: 'ctaLabel',  type: 'text',  label: 'Testo bottone', default: 'Inizia gratis — è semplice' },
        { id: 'bgColor',   type: 'color', label: 'Sfondo',        default: '#6366f1' },
        { id: 'textColor', type: 'color', label: 'Testo',         default: '#ffffff' },
      ],
    },
  ],
}
