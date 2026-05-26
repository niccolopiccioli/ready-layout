'use client'

import { useEffect, useRef, useState } from 'react'

const PREVIEW_W = 1280
const THUMB_H = 210

export function TemplateThumb({ templateId }: { templateId: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [computedScale, setComputedScale] = useState(300 / PREVIEW_W)

  // Lazy-load: only mount iframe once the card enters viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Scale iframe to fill the container width
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setComputedScale(el.clientWidth / PREVIEW_W)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: THUMB_H,
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--ed-border-subtle)',
        flexShrink: 0,
      }}
    >
      {/* Skeleton while loading */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 animate-pulse ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{ background: 'var(--ed-border)' }}
      />

      {visible && (
        <iframe
          src={`/preview/${templateId}?clean=true`}
          onLoad={() => setLoaded(true)}
          aria-hidden="true"
          tabIndex={-1}
          title=""
          style={{
            width: PREVIEW_W,
            height: THUMB_H / computedScale,
            transform: `scale(${computedScale})`,
            transformOrigin: 'top left',
            border: 'none',
            pointerEvents: 'none',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s',
          }}
        />
      )}
    </div>
  )
}
