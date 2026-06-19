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
    <div className="flex flex-col gap-1.5">
      <span className="ed-label">{label}</span>
      <div className="flex flex-col gap-1">
        {value.map((item, i) => (
          <div
            key={item['id'] || item['title'] || item['name'] || item['question'] || i}
            className="rounded overflow-hidden"
            style={{ border: '1px solid var(--ed-border)' }}
          >
            <button
              className="ed-press w-full flex items-center justify-between px-3 py-3 min-h-[44px] text-[13px] text-left"
              style={{ background: 'var(--ed-surface)', color: 'var(--ed-text)' }}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              <span className="font-medium truncate">
                {item['icon'] ? `${item['icon']} ` : ''}{item['title'] || item['name'] || item['question'] || `Item ${i + 1}`}
              </span>
              <div className="flex items-center gap-0.5 shrink-0 ml-2">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); removeItem(i) }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); removeItem(i) } }}
                  className="ed-press inline-flex items-center justify-center rounded"
                  style={{ color: 'var(--ed-muted)', width: 20, height: 20, cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'oklch(55% 0.2 25)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ed-muted)')}
                  aria-label="Rimuovi elemento"
                >
                  <X className="w-3 h-3" />
                </span>
                <ChevronDown
                  className="w-3.5 h-3.5"
                  style={{
                    color: 'var(--ed-muted)',
                    transition: 'transform var(--dur-hover) var(--ease-out)',
                    transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </div>
            </button>
            {openIndex === i && (
              <div
                className="px-3 pt-3 pb-3 flex flex-col gap-3"
                style={{ borderTop: '1px solid var(--ed-border-subtle)', background: 'var(--ed-bg)' }}
              >
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
        ))}
      </div>
      <button
        onClick={addItem}
        className="ed-press text-[12px] font-medium py-3 min-h-[44px] rounded inline-flex items-center justify-center gap-1.5"
        style={{
          border: '1px dashed var(--ed-border)',
          color: 'var(--ed-secondary)',
          background: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--ed-accent)'
          e.currentTarget.style.color = 'var(--ed-accent)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--ed-border)'
          e.currentTarget.style.color = 'var(--ed-secondary)'
        }}
      >
        <Plus className="w-3.5 h-3.5" />
        Aggiungi
      </button>
    </div>
  )
}
