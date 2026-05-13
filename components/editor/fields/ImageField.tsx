'use client'

interface ImageFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

export function ImageField({ id, label, value, onChange }: ImageFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="ed-label">{label}</label>
      {value && (
        <div
          className="w-full h-20 rounded overflow-hidden"
          style={{ border: '1px solid var(--ed-border)' }}
        >
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>
      )}
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://…"
        className="ed-input"
        spellCheck={false}
      />
    </div>
  )
}
