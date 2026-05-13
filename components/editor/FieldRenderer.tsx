'use client'

import type { Field } from '@/lib/schemas/types'
import { TextField } from './fields/TextField'
import { ColorField } from './fields/ColorField'
import { ImageField } from './fields/ImageField'
import { EmojiField } from './fields/EmojiField'
import { RepeaterField } from './fields/RepeaterField'

interface FieldRendererProps {
  field: Field
  value: unknown
  onChange: (value: unknown) => void
}

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  switch (field.type) {
    case 'text':
      return (
        <TextField
          id={field.id}
          label={field.label}
          value={value as string}
          multiline={field.multiline}
          onChange={onChange}
        />
      )
    case 'color':
      return (
        <ColorField
          id={field.id}
          label={field.label}
          value={value as string}
          onChange={onChange}
        />
      )
    case 'image':
      return (
        <ImageField
          id={field.id}
          label={field.label}
          value={value as string}
          onChange={onChange}
        />
      )
    case 'emoji':
      return (
        <EmojiField
          id={field.id}
          label={field.label}
          value={value as string}
          onChange={onChange}
        />
      )
    case 'repeater':
      return (
        <RepeaterField
          id={field.id}
          label={field.label}
          value={value as Record<string, string>[]}
          itemSchema={field.itemSchema}
          onChange={onChange}
        />
      )
    default:
      return null
  }
}
