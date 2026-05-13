import type { TemplateSchema } from './types'

export const bistroSchema: TemplateSchema = {
  id: 'bistro',
  name: 'Local Bistro',
  description: 'Sito per ristoranti, trattorie e caffè. Menu stagionale, storia e prenotazioni.',
  category: 'landing',
  sections: [
    {
      id: 'hero',
      label: 'Hero',
      blockType: 'hero',
      fields: [
        { id: 'headline',    type: 'text',  label: 'Titolo principale', default: 'Trattoria Vista\nCucina di stagione' },
        { id: 'subheadline', type: 'text',  label: 'Sottotitolo',       default: 'Aperto martedì–domenica · 19:00–23:30', multiline: true },
        { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA',         default: 'Prenota un tavolo' },
        { id: 'bgColor',     type: 'color', label: 'Sfondo',            default: '#1a0f0a' },
        { id: 'textColor',   type: 'color', label: 'Testo',             default: '#f5ede0' },
        { id: 'accentColor', type: 'color', label: 'Colore accento',    default: '#d97742' },
      ],
    },
    {
      id: 'story',
      label: 'La storia',
      blockType: 'about',
      fields: [
        { id: 'eyebrow',   type: 'text',  label: 'Occhiello',  default: 'La nostra storia' },
        { id: 'headline',  type: 'text',  label: 'Titolo',     default: 'Nata da una passione\nper gli ingredienti veri.' },
        { id: 'body',      type: 'text',  label: 'Corpo testo', default: 'Trattoria Vista è nata nel 2019 da un\'idea semplice: portare in tavola solo quello che la stagione offre, acquistato da piccoli produttori locali. La nostra cucina cambia ogni mese, seguendo i ritmi della terra. Abbiamo dodici tavoli, una cantina curata e la convinzione che mangiare bene sia un atto di cura verso se stessi e il territorio.', multiline: true },
        { id: 'image',     type: 'image', label: 'Immagine',   default: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80' },
        { id: 'bgColor',   type: 'color', label: 'Sfondo',     default: '#f5ede0' },
        { id: 'textColor', type: 'color', label: 'Testo',      default: '#1a0f0a' },
      ],
    },
    {
      id: 'menu',
      label: 'Menu',
      blockType: 'menu',
      fields: [
        { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Il menu di marzo' },
        { id: 'subtext',      type: 'text', label: 'Sottotitolo',    default: 'Cambia ogni mese in base alla stagione. Tutti i prodotti sono locali e a km 0.', multiline: true },
        {
          id: 'groups',
          type: 'repeater',
          label: 'Gruppi del menu',
          default: [
            {
              groupName: 'Antipasti',
              items: 'Burrata con pomodori confit — 14€\nCrudo di cernia con limone e capperi — 16€\nVerdure di stagione in agrodolce — 10€\nTartare di fassona con tuorlo d\'uovo — 18€\nFocaccia al rosmarino con lardo — 9€',
            },
            {
              groupName: 'Primi',
              items: 'Tagliolini al ragù bianco di coniglio — 18€\nRisotto alle erbe con caprino — 16€\nPappardelle al cinghiale — 20€\nZuppa di legumi con olio nuovo — 13€',
            },
            {
              groupName: 'Secondi',
              items: 'Filetto di trota con burro alle erbe — 24€\nAgnello al forno con patate al rosmarino — 26€\nPollo ruspante arrosto — 20€\nVerdure gratinate con provola — 15€',
            },
          ],
          itemSchema: [
            { id: 'groupName', type: 'text', label: 'Nome gruppo', default: 'Categoria' },
            { id: 'items',     type: 'text', label: 'Piatti (uno per riga, "Nome — Prezzo")', default: 'Piatto uno — 12€\nPiatto due — 15€' },
          ],
        },
      ],
    },
    {
      id: 'reviews',
      label: 'Recensioni',
      blockType: 'testimonials',
      fields: [
        { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Cosa dicono gli ospiti' },
        {
          id: 'items',
          type: 'repeater',
          label: 'Testimonianze',
          default: [
            { quote: 'Un\'esperienza che va oltre il cibo. Il risotto alle erbe era semplicemente perfetto, e l\'accoglienza calorosa come a casa di amici.', author: 'Giulia R.', role: 'Milano', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
            { quote: 'Il menu cambia ma la qualità è costante. Torniamo ogni mese per scoprire cosa la cucina ha preparato. Un ristorante raro.', author: 'Luca M.', role: 'Torino', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
            { quote: 'Atmosfera intima, vini scelti con cura, cucina autentica. La zuppa di legumi con olio nuovo è un piatto che non dimentichi.', author: 'Federica C.', role: 'Bologna', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
          ],
          itemSchema: [
            { id: 'quote',  type: 'text',  label: 'Citazione',         default: 'Un\'esperienza indimenticabile.' },
            { id: 'author', type: 'text',  label: 'Nome',              default: 'Nome Cognome' },
            { id: 'role',   type: 'text',  label: 'Città o descrizione', default: 'Milano' },
            { id: 'avatar', type: 'image', label: 'Foto avatar',       default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
          ],
        },
      ],
    },
    {
      id: 'book',
      label: 'Prenota',
      blockType: 'contact',
      fields: [
        { id: 'sectionTitle',      type: 'text',  label: 'Titolo sezione',        default: 'Prenota un tavolo' },
        { id: 'subtext',           type: 'text',  label: 'Sottotitolo',           default: 'Siamo aperti martedì–domenica dalle 19:00. Per gruppi oltre 6 persone, chiamaci direttamente al 051 123 4567.', multiline: true },
        { id: 'submitLabel',       type: 'text',  label: 'Testo bottone invio',   default: 'Invia richiesta' },
        { id: 'emailPlaceholder',  type: 'text',  label: 'Placeholder email',     default: 'La tua email' },
        { id: 'showName',          type: 'text',  label: 'Mostra campo nome (true/false)', default: 'true' },
        { id: 'showMessage',       type: 'text',  label: 'Mostra campo messaggio (true/false)', default: 'true' },
        { id: 'bgColor',           type: 'color', label: 'Sfondo',                default: '#1a0f0a' },
        { id: 'textColor',         type: 'color', label: 'Testo',                 default: '#f5ede0' },
      ],
    },
  ],
}
