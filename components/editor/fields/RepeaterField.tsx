'use client'

import { useState } from 'react'
import { ChevronDown, X, Plus } from 'lucide-react'
import type { Field, RepeaterItemField } from '@/lib/schemas/types'
import { FieldRenderer } from '../FieldRenderer'

interface RepeaterFieldProps {
  id: string
  label: string
  value: Record<string, string>[]
  itemSchema: RepeaterItemField[]
  onChange: (value: Record<string, string>[]) => void
}

export function RepeaterField({ id, label, value, itemSchema, onChange }: RepeaterFieldProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function updateItem(index: number, fieldId: string, fieldValue: string) {
    const next = value.map((item, i) =>
      i === index ? { ...item, [fieldId]: fieldValue } : item
    )
    onChange(next)
  }

  function addItem() {
    const newItem = Object.fromEntries(itemSchema.map((f) => [f.id, f.default]))
    onChange([...value, newItem])
    setOpenIndex(value.length)
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index))
    if (openIndex === index) setOpenIndex(null)
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="ed-label flex items-center justify-between">
        <span>{label}</span>
        <span className="font-hud text-[9px] text-cyan-300/60 tabular-nums">{value.length} ITEMS</span>
      </span>
      <div className="flex flex-col gap-1.5">
        {value.map((item, i) => {
          const open = openIndex === i
          return (
            <div key={item['id'] || item['title'] || item['name'] || item['question'] || i}
              className="rounded-xl overflow-hidden border transition-all"
              style={{ borderColor: open ? 'rgba(0,229,255,0.4)' : 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', boxShadow: open ? '0 0 24px rgba(0,229,255,0.1)' : 'none' }}>
              <button
                className="ed-press w-full flex items-center gap-2.5 px-3 py-3 min-h-[48px] text-[13px] text-left"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
              >
                <span className="font-hud text-[9px] tabular-nums px-1.5 py-1 rounded-md border border-white/10 bg-black/40 text-white/45 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-semibold truncate flex-1 text-white/85">
                  {item['icon'] ? `${item['icon']} ` : ''}{item['title'] || item['name'] || item['question'] || `Item ${i + 1}`}
                </span>
                <span role="button" tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); removeItem(i) }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); removeItem(i) } }}
                  className="ed-press w-7 h-7 grid place-items-center rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                  aria-label="Rimuovi elemento">
                  <X size={13} />
                </span>
                <ChevronDown size={14} className="text-white/35 shrink-0 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
              </button>
              {open && (
                <div className="px-3 pt-3 pb-4 flex flex-col gap-3 border-t border-cyan-400/15 bg-black/30">
                  {itemSchema.map((subField) => (
                    <FieldRenderer
                      key={subField.id}
                      field={subField as Field}
                      value={item[subField.id] ?? subField.default}
                      onChange={(val) => updateItem(i, subField.id, val as string)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <button onClick={addItem}
        className="ed-press text-[12px] font-bold py-3.5 rounded-xl inline-flex items-center justify-center gap-2 border border-dashed border-cyan-400/35 bg-cyan-400/5 text-cyan-200 hover:bg-cyan-400/12 hover:border-cyan-400/60">
        <Plus size={14} strokeWidth={2.8} /> AGGIUNGI ELEMENTO
      </button>
    </div>
  )
}
