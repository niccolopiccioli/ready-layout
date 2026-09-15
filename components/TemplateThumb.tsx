'use client'

import { useEffect, useRef, useState } from 'react'

const PREVIEW_W = 1280
const THUMB_H = 300

export function TemplateThumb({ templateId, accent }: { templateId: string; accent?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [scale, setScale] = useState(300 / PREVIEW_W)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { rootMargin: '320px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setScale(el.clientWidth / PREVIEW_W)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative w-full overflow-hidden bg-[#0a0a12]" style={{ height: THUMB_H }}>
      {/* scanline sweep */}
      <div className="absolute inset-x-0 h-10 z-10 pointer-events-none opacity-60" style={{ animation: 'scan-y 5s linear infinite', background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.08), transparent)' }} />
      {!loaded && (
        <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015))' }}>
          <div className="absolute inset-8 rounded-xl border border-dashed border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-hud text-[10px] tracking-[0.3em] text-white/30">LOADING MODULE…</div>
        </div>
      )}
      {visible && (
        <iframe
          src={`/preview/${templateId}?clean=true`}
          onLoad={() => setLoaded(true)}
          aria-hidden
          tabIndex={-1}
          title=""
          style={{
            width: PREVIEW_W,
            height: THUMB_H / scale,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            border: 'none',
            pointerEvents: 'none',
            opacity: loaded ? 1 : 0,
            transition: 'opacity .5s',
            filter: loaded ? 'saturate(1.05)' : 'none',
          }}
        />
      )}
      {/* bottom fade + accent line */}
      <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent, rgba(5,5,10,0.55))' }} />
      <div className="absolute bottom-0 inset-x-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accent ?? '#00e5ff'}, transparent)` }} />
    </div>
  )
}
