'use client'

import { useMemo, useState } from 'react'
import { useEditorStore } from '@/lib/store/editor-context'
import { FieldRenderer } from './FieldRenderer'
import { useLayoutPicker } from './picker/LayoutPickerContext'
import { cssColorToHex } from '@/lib/colorUtils'
import type { Field } from '@/lib/schemas/types'

const BLOCK_LABELS: Record<string, string> = {
  hero: 'Hero',
  features: 'Features',
  pricing: 'Pricing',
  faq: 'FAQ',
  cta: 'Call to Action',
  about: 'About',
  gallery: 'Galleria',
  articles: 'Articoli',
  contact: 'Contatti',
  linklist: 'Link List',
  menu: 'Menu',
  products: 'Prodotti',
  testimonials: 'Testimonianze',
  stats: 'Statistiche',
  schedule: 'Orari',
  textblock: 'Testo libero',
}

const BLOCK_ICONS: Record<string, string> = {
  hero: '⬡',
  features: '◈',
  pricing: '◎',
  faq: '◇',
  cta: '▶',
  about: '◉',
  gallery: '▣',
  articles: '▤',
  contact: '◻',
  linklist: '⊞',
  menu: '≡',
  products: '◼',
  testimonials: '❝',
  stats: '▦',
  schedule: '◷',
  textblock: '▬',
}

export function Sidebar() {
  const storeSections = useEditorStore((s) => s.sections)
  const sectionOrder = useEditorStore((s) => s.sectionOrder)
  const values = useEditorStore((s) => s.values)
  const activeSection = useEditorStore((s) => s.activeSection)
  const setActiveSection = useEditorStore((s) => s.setActiveSection)
  const updateField = useEditorStore((s) => s.updateField)
  const removeSection = useEditorStore((s) => s.removeSection)
  const reset = useEditorStore((s) => s.reset)

  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null)
  const { openPicker } = useLayoutPicker()

  const orderedSections = useMemo(() =>
    sectionOrder
      .map((id) => storeSections.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined),
    [storeSections, sectionOrder]
  )

  const section = orderedSections.find((s) => s.id === activeSection)

  // Group fields by type
  const groups = useMemo(() => {
    if (!section) return { text: [], color: [], image: [], emoji: [], repeater: [] }
    const text: Field[] = []
    const color: Field[] = []
    const image: Field[] = []
    const emoji: Field[] = []
    const repeater: Field[] = []
    for (const f of section.fields) {
      if (f.type === 'text') text.push(f)
      else if (f.type === 'color') color.push(f)
      else if (f.type === 'image') image.push(f)
      else if (f.type === 'emoji') emoji.push(f)
      else if (f.type === 'repeater') repeater.push(f)
    }
    return { text, color, image, emoji, repeater }
  }, [section])

  const sectionValues = values[activeSection] ?? {}

  return (
    <aside
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderLeft: '1px solid var(--ed-border)',
        background: 'var(--ed-panel)',
        fontFamily: 'var(--font-sora), var(--font-hanken), ui-sans-serif, system-ui, sans-serif',
      }}
      aria-label="Pannello proprietà"
    >
      {/* Section list */}
      <div
        style={{
          padding: '12px 12px 10px',
          borderBottom: '1px solid var(--ed-border)',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ed-muted)',
            marginBottom: '6px',
            paddingLeft: 4,
          }}
        >
          Sezioni
        </div>
        <div
          style={{
            maxHeight: 200,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {orderedSections.map((s, idx) => {
            const isActive = s.id === activeSection
            const isFirst = idx === 0
            const isConfirming = confirmRemoveId === s.id

            return (
              <div
                key={s.id}
                className="group"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  borderRadius: 6,
                  background: isActive ? 'var(--ed-accent-surface)' : 'transparent',
                  transition: 'background var(--dur-hover) var(--ease-out)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--ed-bg)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                <button
                  className="ed-press"
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 10px',
                    borderRadius: 6,
                    background: 'transparent',
                    color: isActive ? 'var(--ed-accent-text)' : 'var(--ed-secondary)',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: isActive ? 500 : 400,
                    textAlign: 'left',
                    cursor: 'pointer',
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <span style={{ fontSize: 12, opacity: 0.75, lineHeight: 1, flexShrink: 0 }}>
                    {BLOCK_ICONS[s.blockType] ?? '○'}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      textAlign: 'left',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.label}
                  </span>
                </button>
                {!isFirst &&
                  (isConfirming ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, paddingRight: 6 }}>
                      <button
                        onClick={() => {
                          removeSection(s.id)
                          setConfirmRemoveId(null)
                        }}
                        className="ed-press"
                        style={{
                          fontSize: 11,
                          color: 'oklch(55% 0.2 25)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px 4px',
                        }}
                      >
                        Rimuovi
                      </button>
                      <button
                        onClick={() => setConfirmRemoveId(null)}
                        className="ed-press"
                        style={{
                          fontSize: 11,
                          color: 'var(--ed-muted)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px 4px',
                        }}
                      >
                        Annulla
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setConfirmRemoveId(s.id)
                      }}
                      aria-label={`Rimuovi sezione ${s.label}`}
                      className="ed-press opacity-0 group-hover:opacity-100"
                      style={{
                        fontSize: 16,
                        lineHeight: 1,
                        color: 'var(--ed-muted)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        transition: 'opacity var(--dur-hover) var(--ease-out), color var(--dur-hover) var(--ease-out)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(55% 0.2 25)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ed-muted)' }}
                    >
                      ×
                    </button>
                  ))}
              </div>
            )
          })}
        </div>
        <button
          onClick={() => openPicker(orderedSections.length > 0 ? orderedSections[orderedSections.length - 1].id : null)}
          className="ed-press"
          style={{
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '7px 10px',
            borderRadius: 6,
            background: 'transparent',
            border: '1px dashed var(--ed-border)',
            color: 'var(--ed-secondary)',
            fontFamily: 'inherit',
            fontSize: 12,
            fontWeight: 500,
            width: '100%',
            cursor: 'pointer',
            transition: 'background var(--dur-hover) var(--ease-out), border-color var(--dur-hover) var(--ease-out)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--ed-bg)'
            e.currentTarget.style.borderColor = 'var(--ed-accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'var(--ed-border)'
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>+</span>
          Aggiungi sezione
        </button>
      </div>

      {/* Fields — scrollable, grouped */}
      <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: '12px 16px 24px' }}>
        {/* Text fields */}
        {groups.text.length > 0 && (
          <FieldGroup label="Testi" icon="T">
            {groups.text.map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={sectionValues[field.id] ?? field.default}
                onChange={(val) => updateField(activeSection, field.id, val)}
              />
            ))}
          </FieldGroup>
        )}

        {/* Color fields */}
        {groups.color.length > 0 && (
          <FieldGroup label="Colori" icon="●">
            <CompactColorRow
              fields={groups.color}
              values={sectionValues}
              sectionId={activeSection}
              onChange={updateField}
            />
          </FieldGroup>
        )}

        {/* Image fields */}
        {(groups.image.length > 0 || groups.emoji.length > 0) && (
          <FieldGroup label="Media" icon="⬜">
            {groups.image.map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={sectionValues[field.id] ?? field.default}
                onChange={(val) => updateField(activeSection, field.id, val)}
              />
            ))}
            {groups.emoji.map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={sectionValues[field.id] ?? field.default}
                onChange={(val) => updateField(activeSection, field.id, val)}
              />
            ))}
          </FieldGroup>
        )}

        {/* Repeater fields */}
        {groups.repeater.length > 0 && (
          <FieldGroup label="Elementi" icon="≡">
            {groups.repeater.map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={sectionValues[field.id] ?? field.default}
                onChange={(val) => updateField(activeSection, field.id, val)}
              />
            ))}
          </FieldGroup>
        )}

        {section?.fields.length === 0 && (
          <div
            style={{
              marginTop: 24,
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--ed-muted)',
            }}
          >
            Nessun campo modificabile
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--ed-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ flex: 1 }} />
        {confirmReset ? (
          <>
            <span style={{ fontSize: 12, color: 'var(--ed-secondary)' }}>Sicuro?</span>
            <ActionBtn onClick={() => setConfirmReset(false)}>Annulla</ActionBtn>
            <ActionBtn
              onClick={() => { reset(); setConfirmReset(false) }}
              variant="danger"
            >
              Sì, resetta
            </ActionBtn>
          </>
        ) : (
          <ActionBtn
            onClick={() => setConfirmReset(true)}
            variant="danger"
            title="Ripristina valori originali"
          >
            Reset tutto
          </ActionBtn>
        )}
      </div>

    </aside>
  )
}

/* ── Compact color palette row ── */
function CompactColorRow({
  fields,
  values,
  sectionId,
  onChange,
}: {
  fields: Field[]
  values: Record<string, unknown>
  sectionId: string
  onChange: (sectionId: string, fieldId: string, value: unknown) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {fields.map((field) => {
        const val = (values[field.id] as string) ?? (field as { default?: string }).default ?? '#000000'
        return (
          <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Swatch + hidden color input */}
            <div
              style={{
                position: 'relative',
                width: 32,
                height: 32,
                borderRadius: 6,
                overflow: 'hidden',
                border: '1px solid var(--ed-border)',
                flexShrink: 0,
                cursor: 'pointer',
              }}
              title={`Cambia ${field.label}`}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: val,
                }}
              />
              <input
                type="color"
                value={cssColorToHex(val)}
                onChange={(e) => onChange(sectionId, field.id, e.target.value)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                }}
                aria-label={field.label}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--ed-secondary)',
                  marginBottom: 3,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                }}
              >
                {field.label}
              </div>
              <input
                type="text"
                value={val}
                onChange={(e) => onChange(sectionId, field.id, e.target.value)}
                className="ed-input font-mono"
                style={{ fontSize: '12px', padding: '4px 8px' }}
                spellCheck={false}
                aria-label={`Valore esadecimale ${field.label}`}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Field group with header ── */
function FieldGroup({
  label,
  icon,
  children,
}: {
  label: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          marginBottom: 10,
          paddingBottom: 7,
          borderBottom: '1px solid var(--ed-border-subtle)',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            color: 'var(--ed-muted)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {icon}
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ed-muted)',
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  )
}

/* ── Footer action button ── */
function ActionBtn({
  onClick,
  disabled = false,
  title,
  variant = 'default',
  children,
}: {
  onClick: () => void
  disabled?: boolean
  title?: string
  variant?: 'default' | 'danger'
  children: React.ReactNode
}) {
  const colors =
    variant === 'danger'
      ? { color: 'oklch(55% 0.2 25)', hoverColor: 'oklch(45% 0.22 25)' }
      : { color: 'var(--ed-muted)', hoverColor: 'var(--ed-secondary)' }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="ed-press"
      style={{
        fontSize: '12px',
        fontFamily: 'inherit',
        color: disabled ? 'var(--ed-muted)' : colors.color,
        background: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: '4px 2px',
        borderRadius: 4,
        transition: 'color var(--dur-hover) var(--ease-out)',
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.color = colors.hoverColor
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = disabled ? 'var(--ed-border)' : colors.color
      }}
    >
      {children}
    </button>
  )
}
