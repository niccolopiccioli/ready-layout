'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useEditorStore } from '@/lib/store/editor-context'
import { LAYOUT_PRESETS, type LayoutPreset } from '@/lib/presets/layouts'
import { WireframePreview } from './picker/WireframePreview'
import { Search, X, Blocks } from 'lucide-react'

interface LayoutPickerProps {
  open: boolean
  insertAfterId: string | null
  onClose: () => void
}

const CATEGORIES: { value: LayoutPreset['category'] | 'all'; label: string }[] = [
  { value: 'all', label: 'Tutti' },
  { value: 'hero', label: 'Hero' },
  { value: 'features', label: 'Features' },
  { value: 'content', label: 'Content' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'social', label: 'Social' },
  { value: 'utility', label: 'Utility' },
]

export function LayoutPicker({ open, insertAfterId, onClose }: LayoutPickerProps) {
  const addSection = useEditorStore((s) => s.addSection)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<LayoutPreset['category'] | 'all'>('all')

  const handleClose = useCallback(() => {
    setQuery('')
    setCategory('all')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, handleClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LAYOUT_PRESETS.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (q && !p.label.toLowerCase().includes(q)) return false
      return true
    })
  }, [query, category])

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" aria-label="Aggiungi sezione" onClick={handleClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(3,3,8,0.75)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()}
        className="animate-slide-up"
        style={{ width: 980, maxWidth: '94vw', maxHeight: '84vh', background: '#0b0b15', border: '1px solid rgba(0,229,255,0.22)', borderRadius: 24, boxShadow: '0 40px 100px -20px rgba(0,0,0,0.9), 0 0 60px rgba(0,229,255,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg,#00e5ff,#7c3aed,#ff2ea6,#00e5ff)', backgroundSize: '200% 100%', animation: 'gradient-shift 5s linear infinite' }} />
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
          <span className="w-9 h-9 rounded-xl grid place-items-center shrink-0" style={{ background: 'linear-gradient(135deg,#00e5ff,#7c3aed)' }}>
            <Blocks size={17} className="text-black" strokeWidth={2.4} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-white text-[16px] tracking-tight">Libreria moduli</div>
            <div className="font-hud text-[9px] tracking-[0.22em] text-cyan-300/60">{filtered.length} PRESET // CLICK PER INIETTARE NEL CANVAS</div>
          </div>
          <button onClick={handleClose} aria-label="Chiudi" className="ed-press w-9 h-9 grid place-items-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-cyan-400/40">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-3.5 border-b border-white/8 flex flex-col gap-2.5 bg-black/30">
          <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 border border-white/10 bg-black/50">
            <Search size={15} className="text-cyan-300/60 shrink-0" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca layout… (hero, pricing, gallery)"
              className="bg-transparent outline-none flex-1 text-[14px] text-white placeholder:text-white/30" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c.value} onClick={() => setCategory(c.value)} className="ed-press px-3.5 py-2 rounded-full font-display text-[10px] font-bold tracking-[0.06em] uppercase border"
                style={category === c.value
                  ? { background: 'linear-gradient(135deg,#00e5ff,#4f7cff)', color: '#02060a', borderColor: 'transparent', fontWeight: 800 }
                  : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)', borderColor: 'rgba(255,255,255,0.09)' }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {filtered.length === 0 ? (
            <div className="text-center py-14">
              <div className="font-display font-bold text-white text-lg">Nessun modulo trovato</div>
              <div className="font-hud text-[10px] tracking-[0.2em] text-white/30 mt-2">PROVA UN’ALTRA QUERY</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14 }}>
              {filtered.map((preset) => (
                <button key={preset.id} onClick={() => { addSection(preset.id, insertAfterId); handleClose() }}
                  className="ed-press group text-left rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] hover:-translate-y-1 transition-all">
                  <div className="pointer-events-none" style={{ width: '100%', aspectRatio: '3 / 2', overflow: 'hidden', position: 'relative', background: '#08080f' }}>
                    <WireframePreview
                      blockType={preset.blockType}
                      accentColor={preset.defaultValues.accentColor as string | undefined}
                      bgColor={preset.defaultValues.bgColor as string | undefined}
                      textColor={preset.defaultValues.textColor as string | undefined}
                    />
                    <span className="absolute top-2 left-2 font-hud text-[8px] tracking-[0.18em] px-2 py-1 rounded-md bg-black/60 backdrop-blur border border-white/15 text-cyan-200 uppercase">{preset.category}</span>
                  </div>
                  <div className="px-3.5 py-3 border-t border-white/8 flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-white flex-1 truncate">{preset.label}</span>
                    <span className="font-hud text-[10px] text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">+ ADD</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
