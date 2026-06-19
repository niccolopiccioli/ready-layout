'use client'

import { useState, useRef, type ReactNode } from 'react'
import { useEditorStore, useIsEditorContext } from '@/lib/store/editor-context'
import { GripVertical } from 'lucide-react'

interface DraggableItemProps {
  sectionId: string
  fieldId: string
  itemIndex: number
  children: ReactNode
}

export function DraggableItem(props: DraggableItemProps) {
  const isEditor = useIsEditorContext()
  if (!isEditor) return <>{props.children}</>
  return <DraggableItemInner {...props} />
}

function DraggableItemInner({ sectionId, fieldId, itemIndex, children }: DraggableItemProps) {
  const reorderElements = useEditorStore((s) => s.reorderElements)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOver, setDragOver] = useState<'top' | 'bottom' | null>(null)
  const itemRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ sectionId, fieldId, itemIndex })
    )
    e.dataTransfer.effectAllowed = 'move'
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setDragOver(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    const rect = itemRef.current?.getBoundingClientRect()
    if (!rect) return
    const midpoint = rect.top + rect.height / 2
    setDragOver(e.clientY < midpoint ? 'top' : 'bottom')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.sectionId === sectionId && data.fieldId === fieldId) {
        const fromIndex = data.itemIndex
        let toIndex = itemIndex
        const rect = itemRef.current?.getBoundingClientRect()
        if (rect) {
          const midpoint = rect.top + rect.height / 2
          if (e.clientY >= midpoint) toIndex = itemIndex + 1
        }
        if (fromIndex !== toIndex && fromIndex !== toIndex - 1) {
          const finalIndex = toIndex > fromIndex ? toIndex - 1 : toIndex
          reorderElements(sectionId, fieldId, fromIndex, finalIndex)
        }
      }
    } catch {
      // dataTransfer payload was not from us; ignore
    }
    setIsDragging(false)
    setDragOver(null)
  }

  return (
    <div
      ref={itemRef}
      className="relative group"
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(null)}
      onDrop={handleDrop}
    >
      {/* Drop indicators — token-based, no banned border-left stripe */}
      {dragOver === 'top' && (
        <div
          className="absolute left-0 right-0 -top-px z-50 rounded"
          style={{ height: '2px', background: 'var(--ed-accent)' }}
        />
      )}
      {dragOver === 'bottom' && (
        <div
          className="absolute left-0 right-0 -bottom-px z-50 rounded"
          style={{ height: '2px', background: 'var(--ed-accent)' }}
        />
      )}

      {/* Drag handle — accent surface on hover, no colored stripe */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-5 z-30 cursor-grab flex items-center justify-center ${
          isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{
          transition: 'opacity var(--dur-hover) var(--ease-out), background var(--dur-hover) var(--ease-out)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--ed-accent-surface)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <GripVertical className="w-3.5 h-3.5" style={{ color: 'var(--ed-accent)' }} />
      </div>

      <div
        className={`pl-5 ${isDragging ? 'opacity-50' : ''}`}
        style={{ transition: 'opacity var(--dur-hover) var(--ease-out)' }}
      >
        {children}
      </div>
    </div>
  )
}
