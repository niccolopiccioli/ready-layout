export type FieldType = 'text' | 'color' | 'image' | 'emoji' | 'repeater'

export type BlockType =
  | 'hero'
  | 'features'
  | 'pricing'
  | 'faq'
  | 'cta'
  | 'about'
  | 'gallery'
  | 'articles'
  | 'contact'
  | 'linklist'
  | 'menu'
  | 'products'
  | 'testimonials'
  | 'stats'
  | 'schedule'
  | 'textblock'

export interface TextField {
  id: string
  type: 'text'
  label: string
  default: string
  multiline?: boolean
}

export interface ColorField {
  id: string
  type: 'color'
  label: string
  default: string
}

export interface ImageField {
  id: string
  type: 'image'
  label: string
  default: string
}

export interface EmojiField {
  id: string
  type: 'emoji'
  label: string
  default: string
}

export interface RepeaterItemField {
  id: string
  type: Exclude<FieldType, 'repeater'>
  label: string
  default: string
}

export interface RepeaterField {
  id: string
  type: 'repeater'
  label: string
  default: Record<string, string>[]
  itemSchema: RepeaterItemField[]
}

export type Field = TextField | ColorField | ImageField | EmojiField | RepeaterField

export interface Section {
  id: string
  label: string
  blockType: BlockType
  variant?: string
  fields: Field[]
}

export interface TemplateSchema {
  id: string
  name: string
  description?: string
  category?: 'landing' | 'portfolio' | 'commerce' | 'content' | 'event' | 'personal'
  sections: Section[]
}

export type TemplateValues = Record<string, Record<string, unknown>>
