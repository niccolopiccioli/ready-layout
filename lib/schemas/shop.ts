import type { TemplateSchema } from './types'

export const shopSchema: TemplateSchema = {
  id: 'shop',
  name: 'E-Shop Core',
  description: 'Negozio online per artigiani e piccoli brand. Catalogo prodotti, recensioni e FAQ.',
  category: 'commerce',
  sections: [
    {
      id: 'hero',
      label: 'Hero',
      blockType: 'hero',
      fields: [
        { id: 'headline',    type: 'text',  label: 'Titolo principale', default: 'Ceramiche fatte a mano\na Faenza, dal 2018.' },
        { id: 'subheadline', type: 'text',  label: 'Sottotitolo',       default: 'Ogni pezzo è unico. Argilla locale, smaltatura artigianale, spedizione in tutta Europa.', multiline: true },
        { id: 'ctaLabel',    type: 'text',  label: 'Testo CTA',         default: 'Sfoglia il catalogo' },
        { id: 'bgColor',     type: 'color', label: 'Sfondo',            default: '#f5f0e8' },
        { id: 'textColor',   type: 'color', label: 'Testo',             default: '#1c1410' },
        { id: 'accentColor', type: 'color', label: 'Colore accento',    default: '#b54a2f' },
      ],
    },
    {
      id: 'catalog',
      label: 'Catalogo',
      blockType: 'products',
      fields: [
        { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Nuovi arrivi' },
        {
          id: 'items',
          type: 'repeater',
          label: 'Prodotti',
          default: [
            { image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80', name: 'Tazza piccola',         price: '48€',  tag: 'edizione limitata' },
            { image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80', name: 'Ciotola da colazione',  price: '62€',  tag: 'nuovo' },
            { image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80', name: 'Piatto piano grande',   price: '85€',  tag: '' },
            { image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80', name: 'Brocca per acqua',      price: '120€', tag: 'bestseller' },
            { image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80', name: 'Set 2 tazze da caffè',  price: '75€',  tag: '' },
            { image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80', name: 'Vaso piccolo',          price: '55€',  tag: 'edizione limitata' },
            { image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80', name: 'Insalatiera ovale',     price: '98€',  tag: '' },
            { image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80', name: 'Porta sapone',          price: '32€',  tag: 'nuovo' },
          ],
          itemSchema: [
            { id: 'image', type: 'image', label: 'Immagine prodotto', default: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80' },
            { id: 'name',  type: 'text',  label: 'Nome prodotto',     default: 'Prodotto' },
            { id: 'price', type: 'text',  label: 'Prezzo',            default: '50€' },
            { id: 'tag',   type: 'text',  label: 'Tag (es. nuovo, bestseller)', default: '' },
          ],
        },
      ],
    },
    {
      id: 'reviews',
      label: 'Recensioni',
      blockType: 'testimonials',
      fields: [
        { id: 'sectionTitle', type: 'text', label: 'Titolo sezione', default: 'Recensioni clienti' },
        {
          id: 'items',
          type: 'repeater',
          label: 'Recensioni',
          default: [
            { quote: 'Ho ricevuto la tazza piccola come regalo e non riesco a usare nient\'altro per il caffè. La qualità è straordinaria, e il packaging era curatissimo.', author: 'Marta D.', role: 'Firenze', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
            { quote: 'Ho ordinato la brocca e il set di tazze. Arrivati in tempi rapidi, imballati perfettamente. Sono oggetti bellissimi che uso ogni giorno.', author: 'Riccardo B.', role: 'Roma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
            { quote: 'Prodotti unici, impossibile trovare roba così altrove. Ho fatto un ordine personalizzato e mi hanno seguita passo passo. Molto soddisfatta.', author: 'Valentina G.', role: 'Genova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
          ],
          itemSchema: [
            { id: 'quote',  type: 'text',  label: 'Citazione',         default: 'Prodotto fantastico.' },
            { id: 'author', type: 'text',  label: 'Nome',              default: 'Nome Cognome' },
            { id: 'role',   type: 'text',  label: 'Città',             default: 'Milano' },
            { id: 'avatar', type: 'image', label: 'Foto avatar',       default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
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
            { question: 'Quanto tempo ci vuole per ricevere l\'ordine?',        answer: 'Spediamo entro 2–3 giorni lavorativi. La consegna in Italia richiede 2–4 giorni, in Europa 5–7 giorni.' },
            { question: 'Posso restituire o cambiare un prodotto?',             answer: 'Sì, accettiamo resi entro 14 giorni dall\'acquisto se il prodotto è integro. Le spese di resa sono a carico del cliente.' },
            { question: 'È possibile fare ordini personalizzati?',              answer: 'Assolutamente. Contattaci via email per discutere forme, colori e smalti su misura. I tempi per ordini custom sono di 3–4 settimane.' },
            { question: 'I prodotti sono adatti alla lavastoviglie?',           answer: 'Sì, tutte le nostre ceramiche sono adatte alla lavastoviglie. Tuttavia, consigliamo il lavaggio a mano per preservare i colori più a lungo.' },
          ],
          itemSchema: [
            { id: 'question', type: 'text', label: 'Domanda', default: 'La tua domanda?' },
            { id: 'answer',   type: 'text', label: 'Risposta', default: 'La risposta qui.' },
          ],
        },
      ],
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      blockType: 'cta',
      fields: [
        { id: 'headline',  type: 'text',  label: 'Titolo',        default: 'Iscriviti alla newsletter' },
        { id: 'subtext',   type: 'text',  label: 'Testo',         default: 'Nuovi arrivi, edizioni limitate e storie dal laboratorio. Niente spam — solo cose belle.' },
        { id: 'ctaLabel',  type: 'text',  label: 'Testo bottone', default: 'Iscrivimi' },
        { id: 'bgColor',   type: 'color', label: 'Sfondo',        default: '#f5f0e8' },
        { id: 'textColor', type: 'color', label: 'Testo',         default: '#1c1410' },
      ],
    },
  ],
}
