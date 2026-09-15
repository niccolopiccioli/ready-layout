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
      {dragOver === 'top' && (
        <div
          className="absolute left-2 right-2 -top-px z-50 rounded-full"
          style={{ height: 3, background: 'linear-gradient(90deg, transparent, #00e5ff, #ff2ea6, transparent)', boxShadow: '0 0 12px #00e5ff' }}
        />
      )}
      {dragOver === 'bottom' && (
        <div
          className="absolute left-2 right-2 -bottom-px z-50 rounded-full"
          style={{ height: 3, background: 'linear-gradient(90deg, transparent, #00e5ff, #ff2ea6, transparent)', boxShadow: '0 0 12px #00e5ff' }}
        />
      )}

      <div
        className={`absolute left-1 top-2 z-30 cursor-grab ${isDragging ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}`}
        style={{ transition: 'all .18s' }}
      >
        <div className="w-6 h-9 rounded-lg grid place-items-center border backdrop-blur-md"
          style={{ background: 'rgba(8,8,16,0.88)', borderColor: 'rgba(0,229,255,0.45)', boxShadow: '0 2px 12px rgba(0,0,0,0.5), 0 0 12px rgba(0,229,255,0.25)' }}>
          <GripVertical size={12} style={{ color: '#00e5ff' }} />
        </div>
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
