'use client'

import { useEditorStore } from '@/lib/store/editor-context'
import { TemplateRenderer } from '@/components/TemplateRenderer'

export function Canvas() {
  const schema = useEditorStore((s) => s.schema)
  const values = useEditorStore((s) => s.values)

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ background: 'var(--ed-bg)' }}
    >
      <div
        className="min-h-full mx-auto"
        style={{
          background: 'var(--ed-canvas)',
          boxShadow: '0 0 0 1px var(--ed-border-subtle)',
        }}
      >
        <TemplateRenderer schema={schema} values={values} />
      </div>
    </div>
  )
}
