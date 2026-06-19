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

export function Canvas({ device = 'desktop' }: CanvasProps) {
  const templateId = useEditorStore(s => s.templateId)
  const setActiveSection = useEditorStore(s => s.setActiveSection)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [iframeHeight, setIframeHeight] = useState(2400)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  const fixedWidth = DEVICE_WIDTH[device] ?? null
  const showFrame = device === 'mobile' || device === 'tablet'

  // Scale to fit available width for mobile/tablet
  useEffect(() => {
    const update = () => {
      if (fixedWidth && containerRef.current) {
        const available = containerRef.current.clientWidth - 48
        setScale(Math.min(available / fixedWidth, 1))
      } else {
        setScale(1)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [fixedWidth])

  // Receive messages from iframe: resize + section activation
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!isTrustedEditorMessage(e)) return
      if (e.data.type === 'readylayout-resize') {
        setIframeHeight(e.data.height)
      }
      if (e.data.type === 'readylayout-section-active') {
        setActiveSection(e.data.sectionId)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [setActiveSection])

  const iframeSrc = `/canvas/${templateId}`

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto flex items-start justify-center p-6"
      style={{ background: 'var(--ed-bg)' }}
    >
      {fixedWidth ? (
        // Mobile / Tablet — fixed width iframe, scaled to fit
        <div
          style={{
            position: 'relative',
            width: fixedWidth * scale,
            height: iframeHeight * scale,
            flexShrink: 0,
          }}
        >
          {/* Device frame ring */}
          {showFrame && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: device === 'mobile' ? 32 * scale : 20 * scale,
                boxShadow: device === 'mobile'
                  ? '0 0 0 10px var(--ed-device-frame), 0 20px 40px -16px rgb(0 0 0 / 0.25)'
                  : '0 0 0 6px var(--ed-device-frame), 0 14px 28px -12px rgb(0 0 0 / 0.18)',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            />
          )}

          {/* Notch */}
          {device === 'mobile' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 96 * scale,
                height: 18 * scale,
                background: 'var(--ed-device-frame)',
                borderBottomLeftRadius: 12 * scale,
                borderBottomRightRadius: 12 * scale,
                zIndex: 20,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Loading skeleton */}
          {!iframeLoaded && (
            <div
              className="absolute inset-0 animate-pulse z-10 pointer-events-none"
              style={{ background: 'var(--ed-border-subtle)', borderRadius: device === 'mobile' ? 32 * scale : 20 * scale }}
            />
          )}

          <iframe
            key={`${device}-${templateId}`}
            src={iframeSrc}
            title="Canvas preview"
            onLoad={() => setIframeLoaded(true)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: fixedWidth,
              height: iframeHeight,
              border: 'none',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              borderRadius: device === 'mobile' ? 32 : 20,
              overflow: 'hidden',
            }}
          />
        </div>
      ) : (
        // Desktop — full width, wrapped for skeleton overlay
        <div style={{ position: 'relative', width: '100%', height: iframeHeight }}>
          {!iframeLoaded && (
            <div
              className="absolute inset-0 animate-pulse z-10 pointer-events-none"
              style={{ background: 'var(--ed-border-subtle)' }}
            />
          )}
          <iframe
            key={`desktop-${templateId}`}
            src={iframeSrc}
            title="Canvas preview"
            onLoad={() => setIframeLoaded(true)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              boxShadow: '0 0 0 1px var(--ed-border-subtle)',
            }}
          />
        </div>
      )}
    </div>
  )
}
