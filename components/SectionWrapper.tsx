'use client'

import type { CSSProperties, ReactNode } from 'react'
import { EyeOff } from 'lucide-react'
import { useIsEditorContext } from '@/lib/store/editor-context'
import {
  getSectionStyle,
  SECTION_PADDING_PX,
  SECTION_RADIUS_PX,
  SECTION_WIDTH_PX,
} from '@/lib/section-style'

interface SectionWrapperProps {
  sectionId: string
  values: Record<string, unknown>
  children: ReactNode
}

/**
 * Wrapper universale per ogni sezione: posizione (sx/centro/dx),
 * larghezza, padding verticale, bordi completi, ombra, visibilità.
 * Con stile ai default non altera il look esistente (solo data-attrs).
 */
export function SectionWrapper({ sectionId, values, children }: SectionWrapperProps) {
  const isEditor = useIsEditorContext()
  const style = getSectionStyle(values)

  if (style.hidden && !isEditor) return null

  const outer: CSSProperties = {}
  const inner: CSSProperties = {}

  // ── visibilità in editor: placeholder invece di null ──
  if (style.hidden && isEditor) {
    return (
      <div
        data-section={sectionId}
        data-section-hidden="true"
        className="mx-auto my-2 max-w-3xl rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-6 text-center"
      >
        <span className="inline-flex items-center gap-2 font-hud text-[10px] tracking-[0.2em] text-white/40">
          <EyeOff size={13} /> SEZIONE NASCOSTA — RIATTIVALA DAL PANNELLO LAYOUT
        </span>
        <div className="mt-3 opacity-40 grayscale pointer-events-none select-none" aria-hidden="true">
          {children}
        </div>
      </div>
    )
  }

  // ── padding verticale extra (oltre quello del blocco) ──
  const padY = SECTION_PADDING_PX[style.paddingY]
  if (padY !== '0px') {
    outer.paddingTop = padY
    outer.paddingBottom = padY
  }

  // ── larghezza + posizione orizzontale ──
  const maxWidth = SECTION_WIDTH_PX[style.width]
  const isFull = style.width === 'full'
  if (!isFull) {
    outer.display = 'flex'
    outer.justifyContent =
      style.align === 'left' ? 'flex-start' : style.align === 'right' ? 'flex-end' : 'center'
    outer.paddingLeft = 16
    outer.paddingRight = 16
    inner.width = '100%'
    inner.maxWidth = maxWidth
    inner.flexShrink = 1
    inner.minWidth = 0
  }

  // ── bordi ──
  if (style.borderEnabled) {
    const w = `${style.borderWidth}px`
    const c = style.borderColor
    if (style.borderPosition === 'all') outer.border = `${w} solid ${c}`
    else if (style.borderPosition === 'top') outer.borderTop = `${w} solid ${c}`
    else outer.borderBottom = `${w} solid ${c}`
    outer.borderRadius = SECTION_RADIUS_PX[style.borderRadius]
    // il bg del blocco deve rispettare il raggio
    if (style.borderPosition === 'all') outer.overflow = 'hidden'
    outer.boxShadow = style.shadow
      ? `${outer.boxShadow ? `${outer.boxShadow}, ` : ''}0 24px 70px -24px rgba(0,0,0,0.55), 0 0 32px ${c}22`
      : outer.boxShadow
  } else if (style.shadow) {
    // ombra anche senza bordo
    inner.boxShadow = '0 24px 70px -24px rgba(0,0,0,0.55)'
    inner.borderRadius = SECTION_RADIUS_PX[style.borderRadius]
    inner.overflow = 'hidden'
  } else if (!isFull && style.borderRadius !== 'none') {
    // contenitore stretto con raggio anche senza bordo/ombra
    inner.borderRadius = SECTION_RADIUS_PX[style.borderRadius]
    inner.overflow = 'hidden'
  }

  const textAlignAttr =
    style.textAlign === 'auto' ? undefined : style.textAlign

  return (
    <div
      data-section-wrap={sectionId}
      data-align={style.align}
      data-width={style.width}
      data-text-align={textAlignAttr}
      style={outer}
    >
      <div data-section-wrap-inner={sectionId} style={inner}>
        {children}
      </div>
    </div>
  )
}
