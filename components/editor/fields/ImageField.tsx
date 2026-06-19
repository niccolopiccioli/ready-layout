'use client'

import { useRef } from 'react'
import { Upload } from 'lucide-react'

interface ImageFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

export function ImageField({ id, label, value, onChange }: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
    // Reset so the same file can be re-selected
    e.target.value = ''
  }

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
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={value.startsWith('data:') ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={value.startsWith('data:') ? 'File caricato' : 'https://…'}
          className="ed-input flex-1 min-w-0"
          spellCheck={false}
        />
        {/* File upload button */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="ed-press flex items-center justify-center rounded shrink-0"
          style={{
            width: 36,
            height: 36,
            background: 'var(--ed-surface)',
            border: '1px solid var(--ed-border)',
            color: 'var(--ed-secondary)',
          }}
          title="Carica immagine dal dispositivo"
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ed-accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ed-secondary)')}
        >
          <Upload className="w-4 h-4" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
