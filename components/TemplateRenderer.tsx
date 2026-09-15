'use client'

import { useState, useRef } from 'react'
import type { Section, TemplateSchema, TemplateValues } from '@/lib/schemas/types'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { SectionWrapper } from '@/components/SectionWrapper'
import { useEditorStore } from '@/lib/store/editor-context'
import { GripVertical } from 'lucide-react'
import { SectionInserter } from './editor/SectionInserter'

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
            <SectionWrapper sectionId={section.id} values={values[section.id] ?? {}}>
              <BlockRenderer
                blockType={section.blockType}
                sectionId={section.id}
                values={values[section.id] ?? {}}
                variant={section.variant}
              />
            </SectionWrapper>
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

  const orderedSections: Section[] = sectionOrder
    .map((id) => storeSections.find((s) => s.id === id))
    .filter((s): s is Section => s !== undefined)

  return (
    <div className="font-sans" data-template={schema.id}>
      <SectionInserter insertAfterId="" />
      {orderedSections.map((section, index) => {
        const prevId = index === 0 ? null : orderedSections[index - 1].id
        return (
          <div key={section.id}>
            {index > 0 && <SectionInserter insertAfterId={prevId} />}
            <DraggableSection section={section} values={values[section.id] ?? {}} index={index} />
          </div>
        )
      })}
      {orderedSections.length > 0 && (
        <SectionInserter insertAfterId={orderedSections[orderedSections.length - 1].id} />
      )}
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
      {/* neon drag handle */}
      <div
        className={`absolute left-2 top-4 z-20 transition-all duration-200 ${isDragging ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <div
          className="w-8 h-12 rounded-xl grid place-items-center cursor-grab active:cursor-grabbing border backdrop-blur-md"
          title="Trascina per riordinare"
          style={{
            background: isDragging ? 'rgba(0,229,255,0.9)' : 'rgba(8,8,16,0.85)',
            borderColor: 'rgba(0,229,255,0.4)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 16px rgba(0,229,255,0.25)',
          }}
        >
          <GripVertical size={15} style={{ color: isDragging ? '#02060a' : '#00e5ff' }} />
        </div>
      </div>

      {dragOver === 'top' && (
        <div className="absolute left-4 right-4 top-0 z-30 rounded-full" style={{ height: 3, background: 'linear-gradient(90deg, transparent, #00e5ff, #ff2ea6, transparent)', boxShadow: '0 0 16px #00e5ff' }} />
      )}
      {dragOver === 'bottom' && (
        <div className="absolute left-4 right-4 bottom-0 z-30 rounded-full" style={{ height: 3, background: 'linear-gradient(90deg, transparent, #00e5ff, #ff2ea6, transparent)', boxShadow: '0 0 16px #00e5ff' }} />
      )}

      <section
        ref={sectionRef}
        data-section={section.id}
        className={isDragging ? 'opacity-40 saturate-150' : ''}
        style={{ cursor: 'grab', transition: 'opacity .18s' }}
      >
        <SectionWrapper sectionId={section.id} values={values}>
          <BlockRenderer
            blockType={section.blockType}
            sectionId={section.id}
            values={values}
            variant={section.variant}
          />
        </SectionWrapper>
      </section>
    </div>
  )
}
