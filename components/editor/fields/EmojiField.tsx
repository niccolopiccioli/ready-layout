'use client'

interface EmojiFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

export function EmojiField({ id, label, value, onChange }: EmojiFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="ed-label">{label}</label>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded flex items-center justify-center text-xl shrink-0"
          style={{ background: 'var(--ed-surface)', border: '1px solid var(--ed-border)' }}
        >
          {value}
        </div>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="ed-input text-center text-base"
          style={{ width: '72px' }}
          maxLength={10}
          placeholder="✨"
        />
      </div>
    </div>
  )
}
