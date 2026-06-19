'use client'

import { cssColorToHex } from '@/lib/colorUtils'

interface ColorFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorField({ id, label, value, onChange }: ColorFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="ed-label">{label}</label>
      <div className="flex items-center gap-2">
        <div
          className="relative shrink-0 w-10 h-10 rounded overflow-hidden cursor-pointer"
          style={{ border: '1px solid var(--ed-border)' }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: value }} />
          <input
            type="color"
            id={id}
            value={cssColorToHex(value)}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="ed-input font-mono text-[12px]"
          maxLength={7}
          placeholder="#000000"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
