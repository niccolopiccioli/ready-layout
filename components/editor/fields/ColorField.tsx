'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ColorFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorField({ id, label, value, onChange }: ColorFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-slate-500 uppercase tracking-wide">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 rounded cursor-pointer border border-slate-200 p-0.5"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-sm font-mono"
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  )
}
