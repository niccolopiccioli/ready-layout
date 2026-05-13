'use client'

import { useEditorStore } from '@/lib/store/editor-context'

export function SectionNav() {
  const sections = useEditorStore((s) => s.schema.sections)
  const activeSection = useEditorStore((s) => s.activeSection)
  const setActiveSection = useEditorStore((s) => s.setActiveSection)

  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-lg flex-wrap">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeSection === section.id
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {section.label}
        </button>
      ))}
    </div>
  )
}
