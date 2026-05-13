'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ImageFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

export function ImageField({ id, label, value, onChange }: ImageFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-slate-500 uppercase tracking-wide">{label}</Label>
      {value && (
        <img src={value} alt="preview" className="w-full h-24 object-cover rounded-lg border border-slate-200" />
      )}
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://... o /path/to/image.png"
        className="text-sm"
      />
    </div>
  )
}
