'use client'

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useEditorStore } from '@/lib/store/editor-context'
import { Canvas } from './Canvas'
import { Sidebar } from './Sidebar'
import { LayoutPicker } from './LayoutPicker'
import { LayoutPickerProvider, useLayoutPicker } from './picker/LayoutPickerContext'
import { Download, FileJson, FileCode, Check, Shuffle, Palette, Eye, Smartphone, Tablet, Monitor, PanelRight, Undo2, Redo2, ChevronLeft, Sparkles } from 'lucide-react'
import { fontMap, fontList, fontCategories, getRandomFont, migrateFontVar, DEFAULT_FONT } from '@/lib/fonts'
import { themes, type DeviceType } from '@/lib/themes'
import { isTrustedEditorMessage } from '@/lib/editor-messaging'
import { applyThemeToSections, randomizeSections } from '@/lib/editor-field-utils'
import { usePersistFlush } from '@/lib/hooks/usePersistFlush'

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
  const storeSections = useEditorStore((s) => s.sections)
  const sectionOrder = useEditorStore((s) => s.sectionOrder)
  const exportTemplate = useEditorStore((s) => s.exportTemplate)
  const updateField = useEditorStore((s) => s.updateField)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const canUndo = useEditorStore((s) => s.canUndo)
  const canRedo = useEditorStore((s) => s.canRedo)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showFontMenu, setShowFontMenu] = useState(false)
  // DEFAULT_FONT sia su server che al primo render client → nessun mismatch hydration.
  // Il font salvato viene letto solo dopo il mount.
  const [currentFont, setCurrentFont] = useState<string>(DEFAULT_FONT)

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const raw = localStorage.getItem('readylayout-font')
      if (raw) setCurrentFont(migrateFontVar(raw))
    })
    return () => cancelAnimationFrame(raf)
  }, [])
  const [device, setDevice] = useState<DeviceType>('desktop')
  const [copied, setCopied] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  usePersistFlush()

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('readylayout-font', currentFont)
  }, [currentFont])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const editable = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      if (editable) return
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if (e.key === 'z' && e.shiftKey) { e.preventDefault(); redo() }
      if (e.key === 'y') { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo])

  const handleExportJSON = () => {
    const data = exportTemplate()
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
    const data = exportTemplate()
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setShowExportMenu(false)
  }

  const applyTheme = useCallback((theme: typeof themes[0]) => {
    applyThemeToSections(storeSections, theme, updateField)
    setShowThemeMenu(false)
  }, [storeSections, updateField])

  const randomizeEverything = useCallback(() => {
    const isDark = Math.random() > 0.5
    const palette = isDark ? generateDarkPalette() : generateComplementaryPalette()
    const newFont = fontMap[getRandomFont()] || DEFAULT_FONT
    setCurrentFont(newFont)
    randomizeSections(
      storeSections,
      {
        palette,
        sampleHeadlines,
        sampleSubheadlines,
        pickHeadline: () => getRandomItem(sampleHeadlines),
        pickSubheadline: () => getRandomItem(sampleSubheadlines),
        randomColor: generateRandomColor,
      },
      updateField
    )
    setShowThemeMenu(false)
  }, [storeSections, updateField])

  return (
    <LayoutPickerProvider>
      <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#05050a' }}>
        {/* ═══ COMMAND DECK ═══ */}
        <header className="shrink-0 z-40 border-b border-white/8" style={{ background: 'rgba(8,8,15,0.9)', backdropFilter: 'blur(24px)' }}>
          {/* top strip */}
          <div className="h-[7px] w-full" style={{ background: 'linear-gradient(90deg, #00e5ff 0%, #7c3aed 45%, #ff2ea6 80%, #00e5ff 100%)', backgroundSize: '200% 100%', animation: 'gradient-shift 6s linear infinite' }} />
          <div className="flex items-center gap-3 px-3 sm:px-4 h-[60px]">
            {/* back + identity */}
            <Link href="/" className="ed-press w-9 h-9 rounded-xl grid place-items-center border border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-cyan-400/10 shrink-0" aria-label="Torna alla home">
              <ChevronLeft size={17} className="text-white/80" />
            </Link>
            <div className="min-w-0 hidden xs:block sm:block">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-hud text-[9px] tracking-[0.24em] text-cyan-300/70">DRAFT // LIVE SYNC</span>
              </div>
              <div className="font-display font-bold text-white text-[15px] tracking-tight truncate leading-tight max-w-[160px] lg:max-w-[260px]">{templateName}</div>
            </div>
            <div className="hidden xl:flex items-center gap-2 font-hud text-[9px] tracking-[0.18em] text-white/30 border-l border-white/8 pl-4 ml-1">
              <span>{sectionOrder.length} SEZIONI</span>
              <span className="text-white/15">/</span>
              <span className="text-cyan-300/60">{templateId}</span>
            </div>

            {/* device switcher */}
            <div className="mx-auto flex items-center p-1 rounded-2xl border border-white/10 bg-black/50 gap-1">
              {([
                { id: 'mobile', icon: Smartphone, label: 'Mobile' },
                { id: 'tablet', icon: Tablet, label: 'Tablet' },
                { id: 'desktop', icon: Monitor, label: 'Desktop' },
              ] as const).map((d) => {
                const Icon = d.icon
                const active = device === d.id
                return (
                  <button
                    key={d.id}
                    onClick={() => setDevice(d.id)}
                    aria-label={d.label}
                    aria-pressed={active}
                    className="ed-press flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-[11px] font-bold"
                    style={active
                      ? { background: 'linear-gradient(135deg,#00e5ff,#4f7cff)', color: '#02060a', boxShadow: '0 2px 16px rgba(0,229,255,0.4)' }
                      : { color: 'rgba(255,255,255,0.45)' }}
                  >
                    <Icon size={14} strokeWidth={2.4} />
                    <span className="hidden lg:inline font-hud tracking-[0.14em]">{d.label.toUpperCase()}</span>
                  </button>
                )
              })}
            </div>

            {/* right cluster */}
            <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
              <a href={`/preview/${templateId}`} target="_blank" rel="noopener noreferrer" aria-label="Anteprima in nuova scheda"
                className="ed-press hidden sm:grid w-9 h-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-cyan-300 hover:border-cyan-400/50">
                <Eye size={16} />
              </a>

              {/* undo/redo */}
              <div className="hidden md:flex items-center rounded-xl border border-white/10 bg-black/40 p-1 gap-0.5">
                <button onClick={undo} disabled={!canUndo} aria-label="Annulla (⌘Z)" title="Annulla (⌘Z)"
                  className="ed-press w-8 h-8 grid place-items-center rounded-lg"
                  style={{ color: canUndo ? '#fff' : 'rgba(255,255,255,0.22)', cursor: canUndo ? 'pointer' : 'not-allowed' }}>
                  <Undo2 size={15} />
                </button>
                <div className="w-px h-5 bg-white/10" />
                <button onClick={redo} disabled={!canRedo} aria-label="Ripristina (⌘⇧Z)" title="Ripristina (⌘⇧Z)"
                  className="ed-press w-8 h-8 grid place-items-center rounded-lg"
                  style={{ color: canRedo ? '#fff' : 'rgba(255,255,255,0.22)', cursor: canRedo ? 'pointer' : 'not-allowed' }}>
                  <Redo2 size={15} />
                </button>
              </div>

              <Dropdown open={showFontMenu} onOpenChange={setShowFontMenu} ariaLabel="Scegli font"
                trigger={<span className="flex items-center gap-2"><span style={{ fontFamily: currentFont, fontSize: 19, lineHeight: 1 }} className="text-white">Ag</span><span className="hidden lg:inline text-[12px] font-bold">Font</span></span>}>
                <div className="font-hud text-[9px] tracking-[0.24em] text-white/35 px-3 pt-2 pb-1">TYPE SYSTEM — {fontList.length} FONT</div>
                <div style={{ maxHeight: 380, overflowY: 'auto' }} className="pb-2">
                  {Object.entries(fontCategories).map(([category, fonts]) => (
                    <div key={category}>
                      <div className="font-hud text-[9px] tracking-[0.24em] text-cyan-300/50 px-3 pt-3 pb-1.5 uppercase">{category}</div>
                      {(fonts as string[]).map((fontKey) => {
                        const fontVar = fontMap[fontKey]
                        const sel = currentFont === fontVar
                        return (
                          <button key={fontKey} onClick={() => { setCurrentFont(fontVar); setShowFontMenu(false) }}
                            className="ed-press w-full flex items-center gap-3 px-3 py-2 rounded-xl mx-1 hover:bg-cyan-400/10"
                            style={{ width: 'calc(100% - 8px)', background: sel ? 'rgba(0,229,255,0.12)' : 'transparent' }}>
                            <span style={{ fontFamily: fontVar, fontSize: 20, width: 30, color: '#fff' }}>Ag</span>
                            <span className="flex-1 text-left capitalize text-[13px] text-white/80">{fontKey.replace('-', ' ')}</span>
                            {sel && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 8px #00e5ff' }} />}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </Dropdown>

              <Dropdown open={showThemeMenu} onOpenChange={setShowThemeMenu} ariaLabel="Scegli tema" width={300}
                trigger={<span className="flex items-center gap-2"><Palette size={15} /><span className="hidden lg:inline text-[12px] font-bold">Temi</span></span>}>
                <button onClick={randomizeEverything} className="ed-press w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed border-cyan-400/30 bg-cyan-400/5 hover:bg-cyan-400/10 m-1" style={{ width: 'calc(100% - 8px)' }}>
                  <span className="w-9 h-9 rounded-xl grid place-items-center shrink-0" style={{ background: 'linear-gradient(135deg,#00e5ff,#ff2ea6)' }}>
                    <Shuffle size={16} className="text-black" strokeWidth={2.5} />
                  </span>
                  <span className="text-left">
                    <span className="block text-[13px] font-bold text-white flex items-center gap-1.5">Randomizza tutto <Sparkles size={12} className="text-cyan-300" /></span>
                    <span className="block text-[11px] text-white/45">Colori · font · testi sample</span>
                  </span>
                </button>
                <div className="font-hud text-[9px] tracking-[0.24em] text-white/35 px-3 pt-2 pb-1">PRESET MATERIA</div>
                {themes.map((theme) => (
                  <button key={theme.name} onClick={() => applyTheme(theme)} className="ed-press w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 m-0.5" style={{ width: 'calc(100% - 4px)' }}>
                    <span className="flex shrink-0 rounded-xl overflow-hidden border border-white/15" style={{ width: 44, height: 32 }}>
                      <span style={{ flex: 1, background: theme.bg }} />
                      <span style={{ flex: 1, background: theme.accent }} />
                      <span style={{ flex: 1, background: theme.text }} />
                    </span>
                    <span className="text-left flex-1">
                      <span className="block text-[13px] font-semibold text-white">{theme.name}</span>
                      <span className="block text-[11px] text-white/40">{theme.description}</span>
                    </span>
                  </button>
                ))}
              </Dropdown>

              <button onClick={() => setShowSidebar(!showSidebar)} aria-label={showSidebar ? 'Nascondi sidebar' : 'Mostra sidebar'}
                className="ed-press w-9 h-9 grid place-items-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-cyan-300 hover:border-cyan-400/50">
                <PanelRight size={16} />
              </button>

              <Dropdown open={showExportMenu} onOpenChange={setShowExportMenu} primary ariaLabel="Esporta progetto" width={250}
                trigger={<span className="flex items-center gap-2 text-[13px] font-extrabold"><Download size={15} strokeWidth={2.6} /><span className="hidden sm:inline">ESPORTA</span></span>}>
                <button onClick={handleExportJSON} className="ed-press w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5">
                  <FileJson size={17} className="text-cyan-300" />
                  <span className="text-[13px] font-semibold text-white">Scarica JSON</span>
                </button>
                <button onClick={handleCopyJSON} className="ed-press w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5">
                  {copied ? <Check size={17} className="text-emerald-400" /> : <FileCode size={17} className="text-white/40" />}
                  <span className="text-[13px] font-semibold" style={{ color: copied ? '#6ee7b7' : '#fff' }}>{copied ? 'Copiato!' : 'Copia negli appunti'}</span>
                </button>
                <div className="mx-3 my-2 h-px bg-white/8" />
                <div className="px-3 pb-2 font-hud text-[9px] tracking-[0.18em] text-white/30">SCHEMA + VALUES + ORDER</div>
              </Dropdown>
            </div>
          </div>
          {/* mobile undo strip */}
          <div className="md:hidden flex items-center gap-2 px-3 pb-2.5">
            <button onClick={undo} disabled={!canUndo} className="flex-1 py-2 rounded-lg border border-white/10 bg-black/40 text-[11px] font-hud tracking-[0.14em] text-white/70 disabled:opacity-30 flex items-center justify-center gap-1.5"><Undo2 size={13} /> UNDO</button>
            <button onClick={redo} disabled={!canRedo} className="flex-1 py-2 rounded-lg border border-white/10 bg-black/40 text-[11px] font-hud tracking-[0.14em] text-white/70 disabled:opacity-30 flex items-center justify-center gap-1.5"><Redo2 size={13} /> REDO</button>
            <a href={`/preview/${templateId}`} target="_blank" rel="noreferrer" className="flex-1 py-2 rounded-lg text-[11px] font-hud tracking-[0.14em] text-center font-bold" style={{ background: 'linear-gradient(135deg,#00e5ff,#4f7cff)', color: '#02060a' }}>PREVIEW ↗</a>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          {/* dotted void behind canvas */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          <Canvas customFont={currentFont} device={device} />
          {showSidebar && (
            <>
              <div className="fixed inset-0 z-20 lg:hidden bg-black/60 backdrop-blur-sm" onClick={() => setShowSidebar(false)} aria-hidden="true" />
              <div className="fixed inset-x-0 top-[67px] bottom-0 z-30 sm:inset-x-auto sm:right-0 sm:w-[360px] lg:static lg:z-auto lg:w-[340px] lg:flex-shrink-0">
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
      if (!isTrustedEditorMessage(e)) return
      if (e.data.type !== 'readylayout-open-picker') return
      const id = e.data.insertAfterId
      if (id !== null && typeof id !== 'string') return
      openPicker(id)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [openPicker])
  return <LayoutPicker open={open} insertAfterId={insertAfterId} onClose={closePicker} />
}

function Dropdown({ open, onOpenChange, trigger, children, ariaLabel, width = 250, primary = false }: {
  open: boolean; onOpenChange: (v: boolean) => void; trigger: React.ReactNode; children: React.ReactNode; ariaLabel: string; width?: number; primary?: boolean
}) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null)

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    setPos({ top: r.bottom + 10, right: window.innerWidth - r.right })
  }, [open])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (!triggerRef.current?.contains(t) && !menuRef.current?.contains(t)) onOpenChange(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false) }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKey) }
  }, [open, onOpenChange])

  return (
    <div className="relative">
      <button ref={triggerRef} onClick={() => onOpenChange(!open)} className="ed-press"
        aria-label={ariaLabel} aria-expanded={open}
        style={primary
          ? { background: open ? '#00b8cc' : 'linear-gradient(135deg,#00e5ff,#4f7cff)', color: '#02060a', padding: '10px 14px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', fontWeight: 800, boxShadow: '0 4px 20px rgba(0,229,255,0.35)' }
          : { color: open ? '#7df3ff' : 'rgba(255,255,255,0.6)', padding: '10px 12px', borderRadius: 12, background: open ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'inline-flex', alignItems: 'center' }}>
        {trigger}
      </button>
      {open && pos && typeof document !== 'undefined' && createPortal(
        <div ref={menuRef} role="menu" aria-label={ariaLabel}
          style={{ position: 'fixed', top: pos.top, right: Math.max(pos.right, 8), width, maxWidth: 'calc(100vw - 16px)', zIndex: 9999, background: 'rgba(12,12,22,0.96)', backdropFilter: 'blur(24px)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 18, boxShadow: '0 24px 70px -12px rgba(0,0,0,0.7), 0 0 40px rgba(0,229,255,0.12)', padding: 6, animation: 'menu-pop var(--dur-pop) var(--ease-out)', transformOrigin: 'top right' }}>
          {children}
          <style>{`@keyframes menu-pop { from { opacity: 0; transform: scale(.96) translateY(-4px); } to { opacity: 1; transform: scale(1); } }`}</style>
        </div>,
        document.body
      )}
    </div>
  )
}
