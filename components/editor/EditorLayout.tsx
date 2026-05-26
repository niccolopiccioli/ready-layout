'use client'

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { useEditorStore } from '@/lib/store/editor-context'
import { Canvas } from './Canvas'
import { Sidebar } from './Sidebar'
import { LayoutPicker } from './LayoutPicker'
import { LayoutPickerProvider, useLayoutPicker } from './picker/LayoutPickerContext'
import { Download, FileJson, FileCode, Check, Shuffle, Palette, Eye, Smartphone, Tablet, Monitor, PanelLeft, PanelLeftClose, Undo2, Redo2 } from 'lucide-react'
import { fontMap, fontList, fontCategories, getRandomFont } from '@/lib/fonts'
import { themes, type DeviceType } from '@/lib/themes'

// Sample content for randomization
const sampleHeadlines = [
  'La soluzione che cercavi',
  'Trasforma la tua idea in realtà',
  'Il futuro è qui',
  'Semplice. Potente. Tuo.',
  'Rivoluziona il tuo workflow',
]

const sampleSubheadlines = [
  'Tutto quello che ti serve per iniziare.',
  'La tecnologia che semplifica la vita.',
  'Trasforma le tue idee in risultati.',
]

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360)
  const chroma = (0.08 + Math.random() * 0.12).toFixed(3)
  const lightness = (35 + Math.random() * 45).toFixed(1)
  return `oklch(${lightness}% ${chroma} ${hue})`
}

function generateComplementaryPalette(): { bg: string; text: string; accent: string } {
  const baseHue = Math.floor(Math.random() * 360)
  return {
    bg: `oklch(97% 0.01 ${(baseHue + 200) % 360})`,
    text: `oklch(18% 0.02 ${baseHue})`,
    accent: `oklch(55% 0.15 ${(baseHue + 40) % 360})`,
  }
}

function generateDarkPalette(): { bg: string; text: string; accent: string } {
  const baseHue = Math.floor(Math.random() * 360)
  return {
    bg: `oklch(12% 0.02 ${baseHue})`,
    text: `oklch(95% 0.01 ${baseHue})`,
    accent: `oklch(72% 0.14 ${(baseHue + 40) % 360})`,
  }
}

export function EditorLayout() {
  const templateName = useEditorStore((s) => s.schema.name)
  const templateId = useEditorStore((s) => s.schema.id)
  const schema = useEditorStore((s) => s.schema)
  const values = useEditorStore((s) => s.values)
  const updateField = useEditorStore((s) => s.updateField)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const canUndo = useEditorStore((s) => s.canUndo)
  const canRedo = useEditorStore((s) => s.canRedo)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showFontMenu, setShowFontMenu] = useState(false)
  const [currentFont, setCurrentFont] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('readylayout-font')
      return saved || 'var(--font-hanken)'
    }
    return 'var(--font-hanken)'
  })
  const [device, setDevice] = useState<DeviceType>('desktop')
  const [copied, setCopied] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = document.querySelector('[data-editor-canvas]') as HTMLElement | null
    if (canvas) canvas.style.fontFamily = currentFont
    if (typeof window !== 'undefined') localStorage.setItem('readylayout-font', currentFont)
  }, [currentFont])

  // Global keyboard shortcuts: undo/redo
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if (e.key === 'z' && e.shiftKey)  { e.preventDefault(); redo() }
      if (e.key === 'y')                 { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo])

  const handleExportJSON = () => {
    const data = { schema, values }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${templateId}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }

  const handleCopyJSON = () => {
    const data = { schema, values }
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setShowExportMenu(false)
  }

  const applyTheme = useCallback((theme: typeof themes[0]) => {
    schema.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.type === 'color') {
          const fieldIdLower = field.id.toLowerCase()
          if (fieldIdLower.includes('bg') || fieldIdLower.includes('background')) {
            updateField(section.id, field.id, theme.bg)
          } else if (fieldIdLower.includes('text') || fieldIdLower.includes('color')) {
            updateField(section.id, field.id, theme.text)
          } else if (fieldIdLower.includes('accent')) {
            updateField(section.id, field.id, theme.accent)
          }
        }
      })
    })
    setShowThemeMenu(false)
  }, [schema, updateField])

  const randomizeEverything = useCallback(() => {
    const isDark = Math.random() > 0.5
    const palette = isDark ? generateDarkPalette() : generateComplementaryPalette()
    const newFont = fontMap[getRandomFont()] || 'var(--font-hanken)'
    setCurrentFont(newFont)
    
    schema.sections.forEach(section => {
      section.fields.forEach(field => {
        const fieldIdLower = field.id.toLowerCase()
        
        if (field.type === 'color') {
          if (fieldIdLower.includes('bg') || fieldIdLower.includes('background')) {
            updateField(section.id, field.id, palette.bg)
          } else if (fieldIdLower.includes('text') || fieldIdLower.includes('color')) {
            updateField(section.id, field.id, palette.text)
          } else if (fieldIdLower.includes('accent')) {
            updateField(section.id, field.id, palette.accent)
          } else {
            updateField(section.id, field.id, generateRandomColor())
          }
        }
        
        if (field.type === 'text') {
          if (fieldIdLower.includes('headline') || fieldIdLower.includes('title')) {
            updateField(section.id, field.id, getRandomItem(sampleHeadlines))
          } else if (fieldIdLower.includes('subheadline') || fieldIdLower.includes('subtext')) {
            updateField(section.id, field.id, getRandomItem(sampleSubheadlines))
          }
        }
      })
    })
    
    setShowThemeMenu(false)
  }, [schema, updateField])

  return (
    <LayoutPickerProvider>
    <div className="flex flex-col h-screen" style={{ background: 'var(--ed-bg)' }}>

      <header
        className="h-20 lg:h-24 flex items-center justify-between px-4 sm:px-6 shrink-0"
        style={{ borderBottom: '1px solid var(--ed-border)', background: 'var(--ed-surface)' }}
      >
        {/* Logo + Template Name */}
        <div className="flex items-center gap-5 min-w-0">
          <Link
            href="/"
            className="ed-press flex items-center shrink-0"
            aria-label="Torna alla home"
          >
            <Image
              src="/website-icon.png"
              alt="ReadyLayout"
              width={600}
              height={600}
              className="object-contain"
              style={{ height: 'clamp(48px, 8vw, 88px)', width: 'auto', maxWidth: '320px' }}
            />
          </Link>
          <div className="hidden lg:block w-px h-14" style={{ background: 'var(--ed-border)' }} />
          <div className="hidden lg:flex flex-col gap-1 min-w-0">
            <span
              className="ed-label shrink-0"
              style={{ color: 'var(--ed-muted)', fontSize: '13px' }}
            >
              Bozza
            </span>
            <span
              className="font-medium truncate"
              style={{ color: 'var(--ed-text)', fontSize: '26px', lineHeight: 1.15 }}
            >
              {templateName}
            </span>
          </div>
        </div>

        {/* Device Switcher — hidden on mobile (already on mobile), visible sm+ */}
        <div
          className="hidden sm:flex items-center"
          style={{
            background: 'var(--ed-bg)',
            border: '1px solid var(--ed-border)',
            borderRadius: '12px',
            padding: '6px',
          }}
        >
          <DeviceButton active={device === 'mobile'} onClick={() => setDevice('mobile')} label="Mobile">
            <Smartphone className="w-7 h-7" />
          </DeviceButton>
          <DeviceButton active={device === 'tablet'} onClick={() => setDevice('tablet')} label="Tablet">
            <Tablet className="w-7 h-7" />
          </DeviceButton>
          <DeviceButton active={device === 'desktop'} onClick={() => setDevice('desktop')} label="Desktop">
            <Monitor className="w-7 h-7" />
          </DeviceButton>
        </div>

        {/* Right toolbar — flex-1 on mobile so it fills after logo; overflow scrolls */}
        <div className="flex-1 sm:flex-none flex items-center gap-2 justify-end overflow-x-auto scrollbar-hide">
          <IconButton
            as="a"
            href={`/preview/${templateId}`}
            target="_blank"
            label="Anteprima in nuova scheda"
          >
            <Eye className="w-6 h-6" />
          </IconButton>

          {/* Undo / Redo */}
          <div
            className="flex items-center gap-0.5"
            style={{
              background: 'var(--ed-bg)',
              border: '1px solid var(--ed-border)',
              borderRadius: '8px',
              padding: '4px',
            }}
          >
            <UndoButton onClick={undo} disabled={!canUndo} label="Annulla (⌘Z)">
              <Undo2 className="w-5 h-5" />
              <span className="hidden lg:inline" style={{ fontSize: '13px', marginLeft: 6 }}>Annulla</span>
            </UndoButton>
            <div style={{ width: 1, height: 20, background: 'var(--ed-border)', margin: '0 2px' }} />
            <UndoButton onClick={redo} disabled={!canRedo} label="Ripristina (⌘⇧Z)">
              <Redo2 className="w-5 h-5" />
              <span className="hidden lg:inline" style={{ fontSize: '13px', marginLeft: 6 }}>Ripristina</span>
            </UndoButton>
          </div>

          {/* Font Picker */}
          <Dropdown
            open={showFontMenu}
            onOpenChange={setShowFontMenu}
            trigger={
              <span className="flex items-center gap-2.5">
                <span style={{ fontFamily: currentFont, fontSize: '22px', lineHeight: 1 }}>Aa</span>
                <span className="hidden lg:inline" style={{ fontSize: '15px' }}>Font</span>
              </span>
            }
            ariaLabel="Scegli font"
          >
            <div style={{ maxHeight: 460, overflowY: 'auto' }}>
              {Object.entries(fontCategories).map(([category, fonts]) => (
                <div key={category}>
                  <div className="ed-label" style={{ padding: '12px 14px 6px', fontSize: '12px' }}>
                    {category === 'serif' ? 'Serif' : category === 'sans' ? 'Sans Serif' : category === 'display' ? 'Display' : 'Monospace'}
                  </div>
                  {fonts.map((fontKey) => {
                    const fontVar = fontMap[fontKey]
                    const isSelected = currentFont === fontVar
                    return (
                      <MenuItem
                        key={fontKey}
                        active={isSelected}
                        onClick={() => {
                          setCurrentFont(fontVar)
                          setShowFontMenu(false)
                        }}
                      >
                        <span style={{ fontFamily: fontVar, fontSize: '22px', width: 32 }}>Aa</span>
                        <span className="flex-1 text-left capitalize" style={{ fontSize: '15px' }}>{fontKey.replace('-', ' ')}</span>
                        {isSelected && (
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: 'var(--ed-accent)' }}
                          />
                        )}
                      </MenuItem>
                    )
                  })}
                </div>
              ))}
            </div>
          </Dropdown>

          {/* Theme Dropdown */}
          <Dropdown
            open={showThemeMenu}
            onOpenChange={setShowThemeMenu}
            trigger={
              <span className="flex items-center gap-2.5">
                <Palette className="w-6 h-6" />
                <span className="hidden lg:inline" style={{ fontSize: '15px' }}>Temi</span>
              </span>
            }
            ariaLabel="Scegli tema"
            width={300}
          >
            <MenuItem onClick={randomizeEverything}>
              <Shuffle className="w-5 h-5" style={{ color: 'var(--ed-accent)' }} />
              <div className="text-left flex-1">
                <div style={{ fontSize: '15px' }}>Randomizza tutto</div>
                <div style={{ fontSize: '13px', color: 'var(--ed-muted)' }}>
                  Colori, font e testi
                </div>
              </div>
            </MenuItem>

            <div
              style={{
                borderTop: '1px solid var(--ed-border-subtle)',
                margin: '6px 0',
              }}
            />
            <div className="ed-label" style={{ padding: '12px 14px 6px', fontSize: '12px' }}>
              Preimpostati
            </div>

            {themes.map((theme, i) => (
              <MenuItem key={i} onClick={() => applyTheme(theme)}>
                <div
                  className="shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '6px',
                    border: '1px solid var(--ed-border)',
                    background: theme.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: theme.accent,
                    }}
                  />
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: theme.text,
                    }}
                  />
                </div>
                <div className="text-left flex-1">
                  <div style={{ fontSize: '15px' }}>{theme.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ed-muted)' }}>
                    {theme.description}
                  </div>
                </div>
              </MenuItem>
            ))}
          </Dropdown>

          {/* Sidebar Toggle */}
          <IconButton
            onClick={() => setShowSidebar(!showSidebar)}
            label={showSidebar ? 'Nascondi sidebar' : 'Mostra sidebar'}
            active={!showSidebar}
          >
            {showSidebar ? <PanelLeftClose className="w-6 h-6" /> : <PanelLeft className="w-6 h-6" />}
          </IconButton>

          <div className="w-px h-8 lg:h-16 mx-2 lg:mx-3" style={{ background: 'var(--ed-border)' }} />

          {/* Esporta — CTA primaria */}
          <Dropdown
            open={showExportMenu}
            onOpenChange={setShowExportMenu}
            primary
            trigger={
              <span className="flex items-center gap-2">
                <Download className="w-5 h-5 lg:hidden" />
                <span className="hidden lg:inline" style={{ fontSize: '17px', fontWeight: 600 }}>Esporta ↓</span>
              </span>
            }
            ariaLabel="Esporta progetto"
            width={240}
          >
            <MenuItem onClick={handleExportJSON}>
              <FileJson className="w-5 h-5" style={{ color: 'var(--ed-muted)' }} />
              <span style={{ fontSize: '15px' }}>Scarica JSON</span>
            </MenuItem>
            <MenuItem onClick={handleCopyJSON}>
              {copied ? (
                <>
                  <Check className="w-5 h-5" style={{ color: 'var(--ed-accent)' }} />
                  <span style={{ fontSize: '15px', color: 'var(--ed-accent-text)' }}>Copiato</span>
                </>
              ) : (
                <>
                  <FileCode className="w-5 h-5" style={{ color: 'var(--ed-muted)' }} />
                  <span style={{ fontSize: '15px' }}>Copia negli appunti</span>
                </>
              )}
            </MenuItem>
          </Dropdown>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Canvas customFont={currentFont} device={device} />
        {showSidebar && (
          <>
            {/* Backdrop — visible only below lg, closes sidebar on tap */}
            <div
              className="fixed inset-0 z-20 lg:hidden"
              style={{ background: 'rgb(0 0 0 / 0.35)' }}
              onClick={() => setShowSidebar(false)}
              aria-hidden="true"
            />
            {/* Sidebar — overlay on mobile/tablet, static panel on desktop */}
            <div className="fixed inset-x-0 top-20 bottom-0 z-30 sm:inset-x-auto sm:right-0 sm:w-80 lg:static lg:top-auto lg:bottom-auto lg:right-auto lg:z-auto lg:w-[300px] lg:flex-shrink-0">
              <Sidebar />
            </div>
          </>
        )}
      </div>
      <PickerBridge />
    </div>
    </LayoutPickerProvider>
  )
}

function PickerBridge() {
  const { open, insertAfterId, openPicker, closePicker } = useLayoutPicker()

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type !== 'readylayout-open-picker') return
      const id = e.data.insertAfterId
      const valid = id === null || typeof id === 'string'
      if (!valid) return
      openPicker(id)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [openPicker])

  return <LayoutPicker open={open} insertAfterId={insertAfterId} onClose={closePicker} />
}

/* ───────────── Header primitives ───────────── */

function UndoButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  disabled: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="ed-press"
      aria-label={label}
      title={label}
      style={{
        padding: '8px 12px',
        borderRadius: '6px',
        background: 'transparent',
        color: disabled ? 'var(--ed-muted)' : 'var(--ed-text)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color var(--dur-hover) var(--ease-out)',
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.color = 'var(--ed-accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = disabled ? 'var(--ed-muted)' : 'var(--ed-text)'
      }}
    >
      {children}
    </button>
  )
}

function DeviceButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="ed-press"
      aria-label={label}
      aria-pressed={active}
      style={{
        padding: '14px 22px',
        borderRadius: '8px',
        background: active ? 'var(--ed-surface)' : 'transparent',
        color: active ? 'var(--ed-accent)' : 'var(--ed-muted)',
        boxShadow: active ? '0 1px 2px rgb(0 0 0 / 0.06)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </button>
  )
}

type IconButtonProps = {
  label: string
  active?: boolean
  children: React.ReactNode
} & (
  | { as?: 'button'; onClick?: () => void; href?: never; target?: never }
  | { as: 'a'; href: string; target?: string; onClick?: never }
)

function IconButton(props: IconButtonProps) {
  const baseStyle: React.CSSProperties = {
    padding: '14px',
    borderRadius: '8px',
    color: props.active ? 'var(--ed-text)' : 'var(--ed-secondary)',
    background: props.active ? 'var(--ed-bg)' : 'transparent',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
  if (props.as === 'a') {
    return (
      <a
        href={props.href}
        target={props.target}
        rel={props.target === '_blank' ? 'noopener noreferrer' : undefined}
        className="ed-press"
        aria-label={props.label}
        style={baseStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ed-text)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = props.active ? 'var(--ed-text)' : 'var(--ed-secondary)')}
      >
        {props.children}
      </a>
    )
  }
  return (
    <button
      onClick={props.onClick}
      className="ed-press"
      aria-label={props.label}
      style={baseStyle}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ed-text)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = props.active ? 'var(--ed-text)' : 'var(--ed-secondary)')}
    >
      {props.children}
    </button>
  )
}

function Dropdown({
  open,
  onOpenChange,
  trigger,
  children,
  ariaLabel,
  width = 220,
  primary = false,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  trigger: React.ReactNode
  children: React.ReactNode
  ariaLabel: string
  width?: number
  primary?: boolean
}) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null)

  // Compute portal position when menu opens
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    setPos({ top: r.bottom + 8, right: window.innerWidth - r.right })
  }, [open])

  // Close on click-outside or Escape
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (!triggerRef.current?.contains(t) && !menuRef.current?.contains(t)) {
        onOpenChange(false)
      }
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false) }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onOpenChange])

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => onOpenChange(!open)}
        className="ed-press"
        aria-label={ariaLabel}
        aria-expanded={open}
        style={
          primary
            ? {
                background: open ? 'oklch(46% 0.14 155)' : 'var(--ed-accent)',
                color: 'var(--ed-canvas)',
                padding: '12px 14px',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
              }
            : {
                color: open ? 'var(--ed-text)' : 'var(--ed-secondary)',
                padding: '12px 16px',
                borderRadius: '8px',
                background: open ? 'var(--ed-bg)' : 'transparent',
                display: 'inline-flex',
                alignItems: 'center',
              }
        }
        onMouseEnter={(e) => { if (!primary) e.currentTarget.style.color = 'var(--ed-text)' }}
        onMouseLeave={(e) => { if (!primary) e.currentTarget.style.color = open ? 'var(--ed-text)' : 'var(--ed-secondary)' }}
      >
        {trigger}
      </button>

      {open && pos && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          role="menu"
          aria-label={ariaLabel}
          style={{
            position: 'fixed',
            top: pos.top,
            right: pos.right,
            width,
            zIndex: 9999,
            background: 'var(--ed-surface)',
            border: '1px solid var(--ed-border)',
            borderRadius: '10px',
            boxShadow: '0 12px 36px -8px rgb(0 0 0 / 0.18), 0 4px 10px -4px rgb(0 0 0 / 0.08)',
            padding: '6px',
            transformOrigin: 'top right',
            animation: 'menu-pop var(--dur-pop) var(--ease-out)',
          }}
        >
          {children}
          <style>{`
            @keyframes menu-pop {
              from { opacity: 0; transform: scale(0.97); }
              to   { opacity: 1; transform: scale(1); }
            }
            @media (prefers-reduced-motion: reduce) {
              @keyframes menu-pop { from { opacity: 0; } to { opacity: 1; } }
            }
          `}</style>
        </div>,
        document.body
      )}
    </div>
  )
}

function MenuItem({
  onClick,
  children,
  active = false,
}: {
  onClick: () => void
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      role="menuitem"
      className="ed-press w-full flex items-center gap-3.5 rounded-lg"
      style={{
        background: active ? 'var(--ed-accent-surface)' : 'transparent',
        color: active ? 'var(--ed-accent-text)' : 'var(--ed-text)',
        textAlign: 'left',
        padding: '10px 14px',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'var(--ed-bg)'
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
    </button>
  )
}