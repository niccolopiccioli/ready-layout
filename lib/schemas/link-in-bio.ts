import type { TemplateSchema } from './types'

export const linkInBioSchema: TemplateSchema = {
  id: 'link-in-bio',
  name: 'Link in Bio',
  description: 'Pagina link-in-bio per creator e influencer. Un hub unico per tutti i tuoi canali.',
  category: 'personal',
  sections: [
    {
      id: 'links',
      label: 'Link',
      blockType: 'linklist',
      fields: [
        { id: 'name',        type: 'text',  label: 'Nome',             default: 'Sara Conti' },
        { id: 'bio',         type: 'text',  label: 'Bio',              default: 'Designer & curator · Milano', multiline: true },
        { id: 'avatar',      type: 'image', label: 'Foto avatar',      default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
        { id: 'bgColor',     type: 'color', label: 'Sfondo',           default: '#2a1638' },
        { id: 'textColor',   type: 'color', label: 'Testo',            default: '#ffffff' },
        { id: 'accentColor', type: 'color', label: 'Colore accento',   default: '#b794f4' },
        {
          id: 'links',
          type: 'repeater',
          label: 'Link',
          default: [
            { label: 'Portfolio',    url: 'https://example.com/portfolio', emoji: '🎨' },
            { label: 'Instagram',    url: 'https://instagram.com',         emoji: '📷' },
            { label: 'Newsletter',   url: 'https://example.com/newsletter',emoji: '✉️' },
            { label: 'YouTube',      url: 'https://youtube.com',           emoji: '📺' },
            { label: 'Shop',         url: 'https://example.com/shop',      emoji: '🛍️' },
            { label: 'Contatti',     url: 'mailto:sara@example.com',       emoji: '📩' },
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
