'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useEditorStore } from '@/lib/store/editor-context'
import { LAYOUT_PRESETS, type LayoutPreset } from '@/lib/presets/layouts'
import { WireframePreview } from './picker/WireframePreview'

interface LayoutPickerProps {
  open: boolean
  insertAfterId: string | null
  onClose: () => void
}

const CATEGORIES: { value: LayoutPreset['category'] | 'all'; label: string }[] = [
  { value: 'all',       label: 'Tutti' },
  { value: 'hero',      label: 'Hero' },
  { value: 'features',  label: 'Features' },
  { value: 'content',   label: 'Content' },
  { value: 'commerce',  label: 'Commerce' },
  { value: 'social',    label: 'Social' },
  { value: 'utility',   label: 'Utility' },
]

export function LayoutPicker({ open, insertAfterId, onClose }: LayoutPickerProps) {
  const addSection = useEditorStore((s) => s.addSection)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<LayoutPreset['category'] | 'all'>('all')

  const handleClose = useCallback(() => {
    setQuery('')
    setCategory('all')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, handleClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LAYOUT_PRESETS.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (q && !p.label.toLowerCase().includes(q)) return false
      return true
    })
  }, [query, category])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Aggiungi sezione"
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgb(0 0 0 / 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 960,
          maxWidth: '90vw',
          maxHeight: '80vh',
          background: 'var(--ed-panel)',
          borderRadius: 12,
          boxShadow: '0 30px 60px -20px rgb(0 0 0 / 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--ed-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--ed-primary)' }}>
            Aggiungi sezione
          </div>
          <button
            onClick={handleClose}
            aria-label="Chiudi"
            className="ed-press"
            style={{
              fontSize: 22,
              lineHeight: 1,
              color: 'var(--ed-muted)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        {/* Toolbar */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--ed-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca un layout…"
            className="ed-input"
            style={{ fontSize: 14, padding: '8px 12px' }}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className="ed-press"
                style={{
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 500,
                  background: category === c.value ? 'var(--ed-accent-surface)' : 'transparent',
                  color: category === c.value ? 'var(--ed-accent-text)' : 'var(--ed-secondary)',
                  border: '1px solid ' + (category === c.value ? 'transparent' : 'var(--ed-border)'),
                  cursor: 'pointer',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--ed-muted)' }}>
              Nessun layout trovato
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 16,
            }}>
              {filtered.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  onClick={() => {
                    addSection(preset.id, insertAfterId)
                    handleClose()
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PresetCard({ preset, onClick }: { preset: LayoutPreset; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ed-press"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        background: 'var(--ed-bg)',
        border: '1px solid var(--ed-border)',
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'pointer',
        textAlign: 'left',
        padding: 0,
        transition: 'border-color var(--dur-hover) var(--ease-out), transform var(--dur-hover) var(--ease-out)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--ed-accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--ed-border)'
      }}
    >
      {/* Wireframe preview */}
      <div style={{
        width: '100%',
        aspectRatio: '3 / 2',
        overflow: 'hidden',
        position: 'relative',
        pointerEvents: 'none',
      }}>
        <WireframePreview
          blockType={preset.blockType}
          accentColor={preset.defaultValues.accentColor as string | undefined}
          bgColor={preset.defaultValues.bgColor as string | undefined}
          textColor={preset.defaultValues.textColor as string | undefined}
        />
      </div>
      {/* Label */}
      <div style={{
        padding: '10px 12px',
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--ed-primary)',
        borderTop: '1px solid var(--ed-border-subtle)',
      }}>
        {preset.label}
      </div>
    </button>
  )
}
