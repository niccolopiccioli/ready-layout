'use client'

import { RichTextField } from '../richtext/RichTextField'

interface TextFieldProps {
  id: string
  label: string
  value: string
  multiline?: boolean
  onChange: (value: string) => void
}

export function TextField({ id, label, value, multiline, onChange }: TextFieldProps) {
  return (
    <RichTextField
      id={id}
      label={label}
      value={value ?? ''}
      multiline={multiline}
      onChange={onChange}
    />
  )
}
