'use client'

import { useState, useRef } from 'react'
import type { Section, TemplateSchema, TemplateValues } from '@/lib/schemas/types'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { useEditorStore } from '@/lib/store/editor-context'
import { GripVertical } from 'lucide-react'
import { SectionInserter } from './editor/SectionInserter'
import { LayoutPicker } from './editor/LayoutPicker'

interface TemplateRendererProps {
  schema: TemplateSchema
  values: TemplateValues
  editable?: boolean
}

export function TemplateRenderer({ schema, values, editable = true }: TemplateRendererProps) {
  if (!editable) {
    return (
      <div className="font-sans" data-template={schema.id}>
        {schema.sections.map((section) => (
          <section key={section.id} data-section={section.id}>
            <BlockRenderer
              blockType={section.blockType}
              sectionId={section.id}
              values={values[section.id] ?? {}}
              variant={section.variant}
            />
          </section>
        ))}
      </div>
    )
  }
  return <EditableTemplate schema={schema} values={values} />
}

function EditableTemplate({ schema, values }: { schema: TemplateSchema; values: TemplateValues }) {
  const storeSections = useEditorStore((s) => s.sections)
  const sectionOrder = useEditorStore((s) => s.sectionOrder)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [insertAfterId, setInsertAfterId] = useState<string | null>(null)

  const orderedSections: Section[] = sectionOrder
    .map((id) => storeSections.find((s) => s.id === id))
    .filter((s): s is Section => s !== undefined)

  const openPicker = (afterId: string | null) => {
    setInsertAfterId(afterId)
    setPickerOpen(true)
  }

  return (
    <div className="font-sans" data-template={schema.id}>
      {/* Inserter all'inizio (sopra la prima sezione) */}
      <SectionInserter onClick={() => openPicker('')} />
      {orderedSections.map((section, index) => {
        const prevId = index === 0 ? null : orderedSections[index - 1].id
        return (
          <div key={section.id}>
            {index > 0 && <SectionInserter onClick={() => openPicker(prevId)} />}
            <DraggableSection section={section} values={values[section.id] ?? {}} index={index} />
          </div>
        )
      })}
      {/* Inserter in coda */}
      {orderedSections.length > 0 && (
        <SectionInserter
          onClick={() => openPicker(orderedSections[orderedSections.length - 1].id)}
        />
      )}
      <LayoutPicker
        open={pickerOpen}
        insertAfterId={insertAfterId}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  )
}

interface DraggableSectionProps {
  section: Section
  values: Record<string, unknown>
  index: number
}

function DraggableSection({ section, values, index }: DraggableSectionProps) {
  const reorderSections = useEditorStore((s) => s.reorderSections)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOver, setDragOver] = useState<'top' | 'bottom' | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', index.toString())
    e.dataTransfer.effectAllowed = 'move'
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setDragOver(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    const midpoint = rect.top + rect.height / 2
    setDragOver(e.clientY < midpoint ? 'top' : 'bottom')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
    if (isNaN(fromIndex)) return

    let toIndex = index
    const rect = sectionRef.current?.getBoundingClientRect()
    if (rect) {
      const midpoint = rect.top + rect.height / 2
      if (e.clientY >= midpoint) toIndex = index + 1
    }

    if (fromIndex !== toIndex && fromIndex !== toIndex - 1) {
      const finalIndex = toIndex > fromIndex ? toIndex - 1 : toIndex
      reorderSections(fromIndex, finalIndex)
    }

    setIsDragging(false)
    setDragOver(null)
  }

  return (
    <div
      className="relative group"
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(null)}
      onDrop={handleDrop}
    >
      {/* Drag handle */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-6 z-20 cursor-grab flex flex-col items-center justify-center ${
          isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{
          marginLeft: '-6px',
          transition: 'opacity var(--dur-hover) var(--ease-out), background var(--dur-hover) var(--ease-out)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--ed-accent-surface)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <GripVertical className="w-4 h-4" style={{ color: 'var(--ed-muted)' }} />
      </div>

      {dragOver === 'top' && (
        <div
          className="absolute left-0 right-0 top-0 z-30"
          style={{ height: '2px', background: 'var(--ed-accent)' }}
        />
      )}
      {dragOver === 'bottom' && (
        <div
          className="absolute left-0 right-0 bottom-0 z-30"
          style={{ height: '2px', background: 'var(--ed-accent)' }}
        />
      )}

      <section
        ref={sectionRef}
        data-section={section.id}
        className={isDragging ? 'opacity-50' : ''}
        style={{
          cursor: 'grab',
          paddingLeft: '8px',
          transition: 'opacity var(--dur-hover) var(--ease-out)',
        }}
      >
        <BlockRenderer
          blockType={section.blockType}
          sectionId={section.id}
          values={values}
          variant={section.variant}
        />
      </section>
    </div>
  )
}
