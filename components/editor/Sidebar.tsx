'use client'

import { useMemo, useState } from 'react'
import { useEditorStore } from '@/lib/store/editor-context'
import { FieldRenderer } from './FieldRenderer'
import { useLayoutPicker } from './picker/LayoutPickerContext'
import { cssColorToHex } from '@/lib/colorUtils'
import { Plus, RotateCcw, Trash2, Type, Palette, Image as ImageIcon, Layers, SlidersHorizontal } from 'lucide-react'
import { SectionStyleControls } from './SectionStyleControls'
import type { Field } from '@/lib/schemas/types'

const BLOCK_LABELS: Record<string, string> = {
  hero: 'Hero', features: 'Features', pricing: 'Pricing', faq: 'FAQ', cta: 'Call to Action',
  about: 'About', gallery: 'Galleria', articles: 'Articoli', contact: 'Contatti', linklist: 'Link List',
  menu: 'Menu', products: 'Prodotti', testimonials: 'Testimonianze', stats: 'Statistiche',
  schedule: 'Orari', textblock: 'Testo libero',
}

export function Sidebar() {
  const storeSections = useEditorStore((s) => s.sections)
  const sectionOrder = useEditorStore((s) => s.sectionOrder)
  const values = useEditorStore((s) => s.values)
  const activeSection = useEditorStore((s) => s.activeSection)
  const setActiveSection = useEditorStore((s) => s.setActiveSection)
  const updateField = useEditorStore((s) => s.updateField)
  const removeSection = useEditorStore((s) => s.removeSection)
  const duplicateSection = useEditorStore((s) => s.duplicateSection)
  const reset = useEditorStore((s) => s.reset)

  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null)
  const { openPicker } = useLayoutPicker()

  const orderedSections = useMemo(() =>
    sectionOrder
      .map((id) => storeSections.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined),
    [storeSections, sectionOrder]
  )

  const section = orderedSections.find((s) => s.id === activeSection)

  const groups = useMemo(() => {
    if (!section) return { text: [], color: [], image: [], emoji: [], repeater: [] as Field[] }
    const text: Field[] = []
    const color: Field[] = []
    const image: Field[] = []
    const emoji: Field[] = []
    const repeater: Field[] = []
    for (const f of section.fields) {
      if (f.type === 'text') text.push(f)
      else if (f.type === 'color') color.push(f)
      else if (f.type === 'image') image.push(f)
      else if (f.type === 'emoji') emoji.push(f)
      else if (f.type === 'repeater') repeater.push(f)
    }
    return { text, color, image, emoji, repeater }
  }, [section])

  const sectionValues = values[activeSection] ?? {}

  return (
    <aside className="flex flex-col h-full border-l border-white/8" style={{ background: 'rgba(8,8,15,0.96)', backdropFilter: 'blur(24px)' }} aria-label="Pannello proprietà">
      {/* HUD header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/8">
        <div className="flex items-center justify-between mb-3">
          <span className="font-hud text-[9px] tracking-[0.26em] text-cyan-300/70 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> CONTROL DECK
          </span>
          <span className="font-hud text-[9px] tracking-[0.18em] text-white/30 tabular-nums">{orderedSections.length} MODULI</span>
        </div>
        <div className="max-h-[218px] overflow-y-auto flex flex-col gap-1 pr-0.5">
          {orderedSections.map((s, idx) => {
            const isActive = s.id === activeSection
            const isFirst = idx === 0
            const isConfirming = confirmRemoveId === s.id
            return (
              <div key={s.id} className="group flex items-center gap-1 rounded-xl border transition-all"
                style={{
                  background: isActive ? 'rgba(0,229,255,0.09)' : 'transparent',
                  borderColor: isActive ? 'rgba(0,229,255,0.35)' : 'transparent',
                  boxShadow: isActive ? '0 0 20px rgba(0,229,255,0.12)' : 'none',
                }}>
                <button onClick={() => setActiveSection(s.id)}
                  className="ed-press flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left min-w-0">
                  <span className="font-hud text-[9px] tabular-nums shrink-0" style={{ color: isActive ? '#7df3ff' : 'rgba(255,255,255,0.28)' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: isActive ? '#00e5ff' : 'rgba(255,255,255,0.18)', boxShadow: isActive ? '0 0 8px #00e5ff' : 'none' }} />
                  <span className="flex-1 truncate text-[13px] font-semibold" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                    {s.label || BLOCK_LABELS[s.blockType] || s.blockType}
                  </span>
                  <span className="font-hud text-[8px] tracking-[0.16em] uppercase hidden group-hover:inline" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.blockType}</span>
                </button>
                {!isFirst && !isConfirming && (
                  <button onClick={(e) => { e.stopPropagation(); setConfirmRemoveId(s.id) }} aria-label={`Rimuovi sezione ${s.label}`}
                    className="ed-press opacity-0 group-hover:opacity-100 w-7 h-7 grid place-items-center rounded-lg text-white/35 hover:text-red-400 hover:bg-red-500/10 mr-1">
                    <Trash2 size={13} />
                  </button>
                )}
                {isConfirming && (
                  <span className="flex items-center gap-1 pr-2">
                    <button onClick={() => { removeSection(s.id); setConfirmRemoveId(null) }} className="ed-press text-[10px] font-bold px-2 py-1 rounded-lg bg-red-500/15 text-red-300 border border-red-500/30">SÌ</button>
                    <button onClick={() => setConfirmRemoveId(null)} className="ed-press text-[10px] px-2 py-1 rounded-lg text-white/50 hover:text-white">NO</button>
                  </span>
                )}
              </div>
            )
          })}
        </div>
        <button onClick={() => openPicker(orderedSections.length > 0 ? orderedSections[orderedSections.length - 1].id : null)}
          className="ed-press mt-2.5 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-cyan-400/30 bg-cyan-400/5 text-cyan-200 text-[12px] font-bold tracking-wide hover:bg-cyan-400/10 hover:border-cyan-400/60">
          <Plus size={14} strokeWidth={2.8} /> AGGIUNGI MODULO
        </button>
      </div>

      {/* active section HUD */}
      {section && (
        <div className="px-4 py-3 border-b border-white/8 flex items-center gap-3 bg-black/30">
          <div className="min-w-0 flex-1">
            <div className="font-hud text-[8px] tracking-[0.26em] text-white/30">EDITING //</div>
            <div className="font-display font-bold text-white text-[15px] tracking-tight truncate">{section.label}</div>
          </div>
          <button onClick={() => duplicateSection(section.id)} title="Duplica sezione"
            className="ed-press font-hud text-[9px] tracking-[0.14em] px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white/55 hover:text-cyan-300 hover:border-cyan-400/40">
            DUPLICA
          </button>
        </div>
      )}

      {/* fields */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {section && (
          <FieldGroup label="Layout & Stile" icon={<SlidersHorizontal size={12} />}>
            <SectionStyleControls
              values={sectionValues}
              onStyleChange={(fieldId, val) => updateField(activeSection, fieldId, val)}
            />
          </FieldGroup>
        )}
        {groups.text.length > 0 && (
          <FieldGroup label="Testi" icon={<Type size={12} />}>
            {groups.text.map((field) => (
              <FieldRenderer key={field.id} field={field} value={sectionValues[field.id] ?? field.default} onChange={(val) => updateField(activeSection, field.id, val)} />
            ))}
          </FieldGroup>
        )}
        {groups.color.length > 0 && (
          <FieldGroup label="Materia / Colori" icon={<Palette size={12} />}>
            <CompactColorRow fields={groups.color} values={sectionValues} sectionId={activeSection} onChange={updateField} />
          </FieldGroup>
        )}
        {(groups.image.length > 0 || groups.emoji.length > 0) && (
          <FieldGroup label="Media" icon={<ImageIcon size={12} />}>
            {groups.image.map((field) => (
              <FieldRenderer key={field.id} field={field} value={sectionValues[field.id] ?? field.default} onChange={(val) => updateField(activeSection, field.id, val)} />
            ))}
            {groups.emoji.map((field) => (
              <FieldRenderer key={field.id} field={field} value={sectionValues[field.id] ?? field.default} onChange={(val) => updateField(activeSection, field.id, val)} />
            ))}
          </FieldGroup>
        )}
        {groups.repeater.length > 0 && (
          <FieldGroup label="Elementi dinamici" icon={<Layers size={12} />}>
            {groups.repeater.map((field) => (
              <FieldRenderer key={field.id} field={field} value={sectionValues[field.id] ?? field.default} onChange={(val) => updateField(activeSection, field.id, val)} />
            ))}
          </FieldGroup>
        )}
        {section?.fields.length === 0 && (
          <div className="mt-10 text-center">
            <div className="font-hud text-[10px] tracking-[0.24em] text-white/30">MODULO VUOTO</div>
            <p className="text-[12px] text-white/40 mt-2">Nessun campo modificabile qui.</p>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="px-4 py-3 border-t border-white/8 flex items-center gap-2 bg-black/40">
        <span className="font-hud text-[8px] tracking-[0.22em] text-white/25">ZONE: DISTRUZIONE</span>
        <span className="flex-1" />
        {confirmReset ? (
          <span className="flex items-center gap-2">
            <span className="text-[11px] text-white/60">Sicuro?</span>
            <button onClick={() => setConfirmReset(false)} className="ed-press text-[11px] px-3 py-1.5 rounded-lg border border-white/12 text-white/60">No</button>
            <button onClick={() => { reset(); setConfirmReset(false) }} className="ed-press text-[11px] font-bold px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300">SÌ, RESET</button>
          </span>
        ) : (
          <button onClick={() => setConfirmReset(true)} title="Ripristina valori originali"
            className="ed-press flex items-center gap-1.5 text-[11px] font-hud tracking-[0.12em] text-white/35 hover:text-red-400">
            <RotateCcw size={12} /> RESET TUTTO
          </button>
        )}
      </div>
    </aside>
  )
}

function CompactColorRow({ fields, values, sectionId, onChange }: {
  fields: Field[]; values: Record<string, unknown>; sectionId: string
  onChange: (sectionId: string, fieldId: string, value: unknown) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {fields.map((field) => {
        const val = (values[field.id] as string) ?? (field as { default?: string }).default ?? '#000000'
        return (
          <div key={field.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-white/8 bg-white/[0.025]">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/15 shrink-0 cursor-pointer" title={`Cambia ${field.label}`} style={{ boxShadow: `0 0 16px ${val}44` }}>
              <div className="absolute inset-0" style={{ backgroundColor: val }} />
              <input type="color" value={cssColorToHex(val)} onChange={(e) => onChange(sectionId, field.id, e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" aria-label={field.label} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-hud text-[8px] tracking-[0.2em] text-white/40 uppercase mb-1">{field.label}</div>
              <input type="text" value={val} onChange={(e) => onChange(sectionId, field.id, e.target.value)}
                className="ed-input font-mono" style={{ fontSize: 12, padding: '6px 9px' }} spellCheck={false} aria-label={`Valore ${field.label}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FieldGroup({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-lg grid place-items-center border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">{icon}</span>
        <span className="font-hud text-[9px] font-bold tracking-[0.22em] uppercase text-white/50">{label}</span>
        <span className="flex-1 h-px bg-gradient-to-r from-cyan-400/25 to-transparent" />
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}
