'use client'

interface TextFieldProps {
  id: string
  label: string
  value: string
  multiline?: boolean
  onChange: (value: string) => void
}

export function TextField({ id, label, value, multiline, onChange }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="ed-label">{label}</label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="ed-input resize-none"
          style={{ lineHeight: '1.5' }}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="ed-input"
        />
      )}
    </div>
  )
}
