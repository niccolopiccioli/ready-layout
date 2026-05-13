'use client'

import { useEditorStore } from '@/lib/store/editor-context'
import { SectionNav } from './SectionNav'
import { FieldRenderer } from './FieldRenderer'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  const schema = useEditorStore((s) => s.schema)
  const values = useEditorStore((s) => s.values)
  const activeSection = useEditorStore((s) => s.activeSection)
  const updateField = useEditorStore((s) => s.updateField)
  const reset = useEditorStore((s) => s.reset)

  const section = schema.sections.find((s) => s.id === activeSection)

  return (
    <div className="w-[400px] shrink-0 border-l border-slate-200 bg-white flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Personalizza</h2>
          <Button variant="ghost" size="sm" onClick={reset} className="text-xs text-slate-400">
            Reset
          </Button>
        </div>
        <SectionNav />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {section?.fields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={values[activeSection]?.[field.id] ?? field.default}
            onChange={(val) => updateField(activeSection, field.id, val)}
          />
        ))}
      </div>
    </div>
  )
}
