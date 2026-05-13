'use client'

import { useEditorStore } from '@/lib/store/editor-context'

export function SectionNav() {
  const sections = useEditorStore((s) => s.schema.sections)
  const activeSection = useEditorStore((s) => s.activeSection)
  const setActiveSection = useEditorStore((s) => s.setActiveSection)

  return (
    <div className="flex items-end" style={{ borderBottom: '1px solid var(--ed-border-subtle)' }}>
      {sections.map((section) => {
        const isActive = activeSection === section.id
        return (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className="relative px-3 py-2 text-[12px] font-medium transition-colors whitespace-nowrap"
            style={{
              color: isActive ? 'var(--ed-accent)' : 'var(--ed-muted)',
              borderBottom: isActive ? '2px solid var(--ed-accent)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {section.label}
          </button>
        )
      })}
    </div>
  )
}
