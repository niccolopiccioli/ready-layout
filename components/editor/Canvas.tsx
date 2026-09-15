'use client'

import { useRef, useEffect, useState } from 'react'
import { useEditorStore } from '@/lib/store/editor-context'
import { isTrustedEditorMessage } from '@/lib/editor-messaging'
import type { DeviceType } from '@/lib/themes'

interface CanvasProps {
  customFont?: string
  device?: DeviceType
}

const DEVICE_WIDTH: Record<string, number> = { mobile: 390, tablet: 768 }
const DEVICE_LABEL: Record<string, string> = { mobile: '390 × FLUID', tablet: '768 × FLUID', desktop: 'FLUID × AUTO' }

export function Canvas({ customFont, device = 'desktop' }: CanvasProps) {
  const templateId = useEditorStore(s => s.templateId)
  const sectionOrder = useEditorStore(s => s.sectionOrder)
  const setActiveSection = useEditorStore(s => s.setActiveSection)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [iframeHeight, setIframeHeight] = useState(2400)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [zoomPct, setZoomPct] = useState(100)

  const fixedWidth = DEVICE_WIDTH[device] ?? null
  const showFrame = device === 'mobile' || device === 'tablet'

  useEffect(() => {
    const update = () => {
      if (fixedWidth && containerRef.current) {
        const available = containerRef.current.clientWidth - 56
        const s = Math.min(available / fixedWidth, 1)
        setScale(s)
        setZoomPct(Math.round(s * 100))
      } else {
        setScale(1)
        setZoomPct(100)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [fixedWidth])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!isTrustedEditorMessage(e)) return
      if (e.data.type === 'readylayout-resize') setIframeHeight(e.data.height)
      if (e.data.type === 'readylayout-section-active') setActiveSection(e.data.sectionId)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [setActiveSection])

  const iframeSrc = `/canvas/${templateId}`

  return (
    <div ref={containerRef} className="flex-1 overflow-auto relative" style={{ background: 'transparent' }}>
      {/* HUD top */}
      <div className="sticky top-0 z-20 flex items-center justify-center gap-3 pt-3 pb-2 pointer-events-none">
        <div className="rl-glass-strong pointer-events-auto flex items-center gap-3 rounded-full pl-4 pr-2 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-hud text-[9px] tracking-[0.22em] text-white/60">CANVAS // {device.toUpperCase()}</span>
          <span className="font-hud text-[9px] tracking-[0.14em] text-cyan-300/80 border border-cyan-400/25 bg-cyan-400/10 rounded-full px-2.5 py-1">{DEVICE_LABEL[device]}</span>
          {showFrame && <span className="font-hud text-[9px] text-white/40 tabular-nums">{zoomPct}%</span>}
          <span className="font-hud text-[9px] text-white/30 tabular-nums hidden sm:inline">{sectionOrder.length} SEC</span>
        </div>
      </div>

      <div className="flex items-start justify-center px-4 sm:px-7 pb-16 pt-1 min-h-full">
        {fixedWidth ? (
          <div style={{ position: 'relative', width: fixedWidth * scale, height: iframeHeight * scale, flexShrink: 0 }}>
            {/* glow */}
            <div className="absolute -inset-6 rounded-[40px] pointer-events-none" style={{ background: 'radial-gradient(closest-side, rgba(0,229,255,0.14), transparent)', filter: 'blur(24px)' }} />
            {/* frame */}
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: device === 'mobile' ? 34 * scale + 10 : 22 * scale + 6,
              background: 'linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03) 30%, rgba(0,229,255,0.18))',
              padding: device === 'mobile' ? 10 : 6,
              boxShadow: '0 40px 90px -20px rgba(0,0,0,0.8), 0 0 60px rgba(0,229,255,0.12)',
            }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: device === 'mobile' ? 34 * scale : 20 * scale, overflow: 'hidden', background: '#fff' }}>
                {device === 'mobile' && (
                  <div style={{ position: 'absolute', top: 8 * scale + 2, left: '50%', transform: 'translateX(-50%)', width: 100 * scale, height: 22 * scale, background: '#0a0a12', borderRadius: 99, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 * scale }}>
                    <span style={{ width: 6 * scale, height: 6 * scale, borderRadius: 99, background: '#1e1e2e' }} />
                  </div>
                )}
                {!iframeLoaded && (
                  <div className="absolute inset-0 z-20 grid place-items-center bg-[#0b0b14]">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto rounded-2xl animate-pulse mb-4" style={{ background: 'linear-gradient(135deg,#00e5ff,#7c3aed)' }} />
                      <div className="font-hud text-[10px] tracking-[0.3em] text-cyan-300/70 animate-pulse">RENDERING…</div>
                    </div>
                  </div>
                )}
                <iframe
                  key={`${device}-${templateId}-${customFont ?? ''}`}
                  src={iframeSrc}
                  title="Canvas preview"
                  onLoad={() => setIframeLoaded(true)}
                  style={{ position: 'absolute', top: 0, left: 0, width: fixedWidth, height: iframeHeight, border: 'none', transform: `scale(${scale})`, transformOrigin: 'top left' }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-[1100px]">
            <div className="absolute -inset-4 rounded-[28px] pointer-events-none" style={{ background: 'radial-gradient(closest-side, rgba(124,58,237,0.16), transparent)', filter: 'blur(28px)' }} />
            <div className="relative rounded-[20px] overflow-hidden border border-white/12 bg-white" style={{ boxShadow: '0 40px 100px -30px rgba(0,0,0,0.85), 0 0 50px rgba(0,229,255,0.08)', height: iframeHeight }}>
              {/* browser chrome */}
              <div className="sticky top-0 z-20 flex items-center gap-2 px-4 h-10 border-b border-black/8 bg-[#0d0d16]">
                <span className="flex gap-1.5">
                  {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
                </span>
                <span className="flex-1 mx-3 h-6 rounded-lg bg-white/6 border border-white/8 font-hud text-[9px] tracking-[0.12em] text-white/40 flex items-center px-3 truncate">◉ /canvas/{templateId} — {iframeHeight}px</span>
                <span className="font-hud text-[9px] text-emerald-400 tracking-[0.18em] hidden sm:inline">● LIVE</span>
              </div>
              {!iframeLoaded && (
                <div className="absolute inset-0 top-10 z-10 grid place-items-center bg-[#0b0b14]">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-2xl animate-pulse mb-4" style={{ background: 'linear-gradient(135deg,#00e5ff,#ff2ea6)' }} />
                    <div className="font-hud text-[10px] tracking-[0.3em] text-cyan-300/70 animate-pulse">COMPILING CANVAS…</div>
                  </div>
                </div>
              )}
              <iframe
                key={`desktop-${templateId}-${customFont ?? ''}`}
                src={iframeSrc}
                title="Canvas preview"
                onLoad={() => setIframeLoaded(true)}
                style={{ position: 'absolute', top: 40, left: 0, width: '100%', height: iframeHeight - 40, border: 'none', background: '#fff' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
