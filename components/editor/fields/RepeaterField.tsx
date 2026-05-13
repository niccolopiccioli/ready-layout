'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
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
    <div className="space-y-2">
      <Label className="text-xs text-slate-500 uppercase tracking-wide">{label}</Label>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-left hover:bg-slate-50 transition-colors"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="font-medium text-slate-700">
                {item['icon'] || item['title'] || item['name'] || item['question'] || `Item ${i + 1}`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(i) }}
                  className="text-slate-400 hover:text-red-500 transition-colors px-1"
                >
                  ×
                </button>
                <span className="text-slate-400">{openIndex === i ? '▲' : '▼'}</span>
              </div>
            </button>
            {openIndex === i && (
              <div className="px-3 pb-3 space-y-3 border-t border-slate-100 pt-3">
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
      <Button variant="outline" size="sm" onClick={addItem} className="w-full text-xs">
        + Aggiungi {label.toLowerCase()}
      </Button>
    </div>
  )
}
