'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface EmojiFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

export function EmojiField({ id, label, value, onChange }: EmojiFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-slate-500 uppercase tracking-wide">{label}</Label>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{value}</span>
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 text-center text-lg"
          maxLength={2}
        />
      </div>
    </div>
  )
}
