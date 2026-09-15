'use client'

import { useRef } from 'react'
import { Upload, Link2 } from 'lucide-react'

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
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="ed-label">{label}</label>
      {value && (
        <div className="relative w-full h-28 rounded-xl overflow-hidden border border-white/10 group">
          <img src={value} alt="preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.45))' }} />
          <span className="absolute bottom-2 left-2 font-hud text-[8px] tracking-[0.2em] text-white/70 bg-black/50 backdrop-blur px-2 py-1 rounded-md border border-white/15">PREVIEW</span>
        </div>
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            id={id}
            type="text"
            value={value.startsWith('data:') ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={value.startsWith('data:') ? '◉ File caricato dal device' : 'https://…'}
            className="ed-input flex-1 min-w-0"
            style={{ paddingLeft: 32 }}
            spellCheck={false}
          />
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="ed-press w-11 h-11 grid place-items-center rounded-xl shrink-0 border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20"
          title="Carica immagine dal dispositivo"
        >
          <Upload size={16} />
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="sr-only" aria-hidden="true" />
      </div>
    </div>
  )
}
