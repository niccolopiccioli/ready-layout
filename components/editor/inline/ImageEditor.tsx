'use client'

import { useState, useRef, useLayoutEffect, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useEditorStore } from '@/lib/store/editor-context'
import { AlertCircle, Link as LinkIcon, LayoutGrid } from 'lucide-react'

interface ImageEditorProps {
  children: ReactNode
}

interface Editing {
  sectionId: string
  fieldId: string
  rect: DOMRect
}

interface HoveredField {
  rect: DOMRect
}

export function ImageEditor({ children }: ImageEditorProps) {
  const [editing, setEditing] = useState<Editing | null>(null)
  const [hoveredField, setHoveredField] = useState<HoveredField | null>(null)
  const updateField = useEditorStore((s) => s.updateField)

  const handleMouseOver = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const field = target.closest('[data-field]') as HTMLElement | null
    if (!field) {
      setHoveredField(null)
      return
    }
    const fieldType = field.getAttribute('data-field-type')
    if (fieldType === 'image') {
      setHoveredField({ rect: field.getBoundingClientRect() })
      e.stopPropagation()
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('[data-image-editor]')) return

    const field = target.closest('[data-field]') as HTMLElement | null
    if (!field) {
      setEditing(null)
      return
    }

    const section = target.closest('[data-section]')
    if (!section) return

    const sectionId = section.getAttribute('data-section')
    const fieldId = field.getAttribute('data-field')
    const fieldType = field.getAttribute('data-field-type')

    if (sectionId && fieldId && fieldType === 'image') {
      setEditing({ sectionId, fieldId, rect: field.getBoundingClientRect() })
      setHoveredField(null)
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleSave = (newValue: string) => {
    if (editing) {
      updateField(editing.sectionId, editing.fieldId, newValue)
      setEditing(null)
    }
  }

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseLeave={() => setHoveredField(null)}
      onClick={handleClick}
    >
      {children}

      {hoveredField && !editing && (
        <div
          className="fixed pointer-events-none z-40"
          style={{
            left: hoveredField.rect.left - 3,
            top: hoveredField.rect.top - 3,
            width: hoveredField.rect.width + 6,
            height: hoveredField.rect.height + 6,
            border: '1.5px solid #00e5ff',
            borderRadius: '12px',
            boxShadow: '0 0 0 4px rgba(0,229,255,0.15), 0 0 24px rgba(0,229,255,0.3)',
          }}
        />
      )}

      {editing && (
        <ImagePopover
          anchorRect={editing.rect}
          sectionId={editing.sectionId}
          fieldId={editing.fieldId}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}

interface ImagePopoverProps {
  anchorRect: DOMRect
  sectionId: string
  fieldId: string
  onSave: (value: string) => void
  onCancel: () => void
}

const imagePresets: { category: string; images: string[] }[] = [
  {
    category: 'Natura',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80',
    ],
  },
  {
    category: 'Business',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    ],
  },
  {
    category: 'Ritratto',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    ],
  },
  {
    category: 'Technology',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'https://images.unsplash.com/photo-1461749280684-d3baade3aede?w=800&q=80',
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
    ],
  },
]

function validateUrl(s: string) {
  try {
    new URL(s)
    return true
  } catch {
    return false
  }
}

function ImagePopover({ anchorRect, sectionId, fieldId, onSave, onCancel }: ImagePopoverProps) {
  const values = useEditorStore((s) => s.values)
  const initialValue = (values[sectionId]?.[fieldId] as string) || ''
  const [url, setUrl] = useState(initialValue)
  const [tab, setTab] = useState<'url' | 'preset'>('url')
  const popoverRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ left: number; top: number; placement: 'below' | 'above' }>({
    left: anchorRect.left,
    top: anchorRect.bottom + 8,
    placement: 'below',
  })

  useLayoutEffect(() => {
    const popover = popoverRef.current
    if (!popover) return
    const popRect = popover.getBoundingClientRect()
    const margin = 12
    const fitsBelow = anchorRect.bottom + popRect.height + margin < window.innerHeight
    const placement: 'below' | 'above' = fitsBelow ? 'below' : 'above'
    const top = placement === 'below' ? anchorRect.bottom + 8 : anchorRect.top - popRect.height - 8
    const left = Math.max(
      margin,
      Math.min(anchorRect.left, window.innerWidth - popRect.width - margin)
    )
    setPosition({ left, top, placement })
  }, [anchorRect, tab])

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onCancel()
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onCancel])

  if (typeof window === 'undefined') return null

  const urlInvalid = url.length > 0 && !validateUrl(url)

  return createPortal(
    <div
      ref={popoverRef}
      data-image-editor="true"
      role="dialog"
      aria-label="Cambia immagine"
      className="fixed z-50"
      style={{
        left: position.left,
        top: position.top,
        width: 360,
        maxWidth: 'calc(100vw - 24px)',
        background: 'rgba(10,10,18,0.97)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,229,255,0.3)',
        borderRadius: '18px',
        boxShadow: '0 24px 70px rgba(0,0,0,0.7), 0 0 40px rgba(0,229,255,0.12)',
        transformOrigin: position.placement === 'below' ? 'top left' : 'bottom left',
        animation: 'image-pop var(--dur-pop) var(--ease-out)',
        overflow: 'hidden',
      }}
    >
      <div
        className="flex items-stretch"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,229,255,0.04)' }}
      >
        <TabButton active={tab === 'url'} onClick={() => setTab('url')} icon={<LinkIcon className="w-3.5 h-3.5" />} label="URL" />
        <TabButton active={tab === 'preset'} onClick={() => setTab('preset')} icon={<LayoutGrid className="w-3.5 h-3.5" />} label="Galleria" />
      </div>

      {tab === 'url' && (
        <div className="p-3 flex flex-col gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://esempio.com/immagine.jpg"
            className="ed-input"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && validateUrl(url)) onSave(url)
            }}
          />
          {urlInvalid && (
            <div className="flex items-center gap-1.5" style={{ fontSize: '11px', color: 'oklch(55% 0.2 25)' }}>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>URL non valido</span>
            </div>
          )}
          <div className="flex items-center justify-end gap-1 mt-1">
            <button
              onClick={onCancel}
              className="ed-press text-[12px] px-2.5 py-1.5 rounded"
              style={{ color: 'var(--ed-secondary)' }}
            >
              Annulla
            </button>
            <button
              onClick={() => onSave(url)}
              disabled={!validateUrl(url)}
              className="ed-press text-[12px] font-bold px-4 py-2 rounded-xl"
              style={{
                background: validateUrl(url) ? 'linear-gradient(135deg,#00e5ff,#4f7cff)' : 'rgba(255,255,255,0.08)',
                color: validateUrl(url) ? '#02060a' : 'rgba(255,255,255,0.3)',
                cursor: validateUrl(url) ? 'pointer' : 'not-allowed',
                boxShadow: validateUrl(url) ? '0 2px 14px rgba(0,229,255,0.4)' : 'none',
              }}
            >
              Applica
            </button>
          </div>
        </div>
      )}

      {tab === 'preset' && (
        <div className="p-3 max-h-[360px] overflow-y-auto flex flex-col gap-3">
          {imagePresets.map((category) => (
            <div key={category.category}>
              <div className="ed-label mb-1.5">{category.category}</div>
              <div className="grid grid-cols-4 gap-1.5">
                {category.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => onSave(img)}
                    className="ed-press aspect-square rounded overflow-hidden"
                    style={{
                      border: '1px solid var(--ed-border)',
                      background: 'var(--ed-bg)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--ed-accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--ed-border)')}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes image-pop {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes image-pop {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        }
      `}</style>
    </div>,
    document.body
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className="ed-press flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-bold"
      style={{
        color: active ? '#7df3ff' : 'rgba(255,255,255,0.4)',
        borderBottom: active ? '2px solid #00e5ff' : '2px solid transparent',
        marginBottom: '-1px',
      }}
    >
      {icon}
      {label}
    </button>
  )
}
