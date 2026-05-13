'use client'

import { useEditorStore } from '@/lib/store/editor-context'
import { SectionNav } from './SectionNav'
import { FieldRenderer } from './FieldRenderer'

export function Sidebar() {
  const schema = useEditorStore((s) => s.schema)
  const values = useEditorStore((s) => s.values)
  const activeSection = useEditorStore((s) => s.activeSection)
  const updateField = useEditorStore((s) => s.updateField)
  const reset = useEditorStore((s) => s.reset)

  const section = schema.sections.find((s) => s.id === activeSection)

  return (
    <div
      className="w-[320px] shrink-0 flex flex-col h-full"
      style={{ borderLeft: '1px solid var(--ed-border)', background: 'var(--ed-panel)' }}
    >
      {/* Header */}
      <div className="px-4 pt-3 pb-0" style={{ borderBottom: '1px solid var(--ed-border-subtle)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="ed-label" style={{ color: 'var(--ed-muted)' }}>Proprietà</span>
          <button
            onClick={reset}
            className="text-[11px] transition-colors"
            style={{ color: 'var(--ed-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ed-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ed-muted)')}
          >
            Reset
          </button>
        </div>
        <SectionNav />
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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
