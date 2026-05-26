'use client'

import type { BlockType } from '@/lib/schemas/types'

interface WireframePreviewProps {
  blockType: BlockType
  accentColor?: string
  bgColor?: string
  textColor?: string
}

const DEFAULT_BG = '#ffffff'
const DEFAULT_TEXT = '#0f172a'
const DEFAULT_ACCENT = '#3b82f6'

const KNOWN = new Set<BlockType>([
  'hero','features','pricing','faq','cta','about','gallery','articles',
  'contact','linklist','menu','products','testimonials','stats','schedule','textblock',
])

export function WireframePreview({ blockType, accentColor, bgColor, textColor }: WireframePreviewProps) {
  const bg = bgColor ?? DEFAULT_BG
  const text = textColor ?? DEFAULT_TEXT
  const accent = accentColor ?? DEFAULT_ACCENT
  const c = { bg, text, accent }

  return (
    <div
      data-wireframe={KNOWN.has(blockType) ? blockType : 'fallback'}
      style={{
        width: '100%',
        height: '100%',
        background: bg,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {renderWireframe(blockType, c)}
    </div>
  )
}

type Colors = { bg: string; text: string; accent: string }

function renderWireframe(blockType: BlockType, c: Colors) {
  switch (blockType) {
    case 'hero':         return Hero(c)
    case 'features':     return Features(c)
    case 'pricing':      return Pricing(c)
    case 'faq':          return Faq(c)
    case 'cta':          return Cta(c)
    case 'about':        return About(c)
    case 'gallery':      return Gallery(c)
    case 'articles':     return Articles(c)
    case 'contact':      return Contact(c)
    case 'linklist':     return LinkList(c)
    case 'menu':         return Menu(c)
    case 'products':     return Products(c)
    case 'testimonials': return Testimonials(c)
    case 'stats':        return Stats(c)
    case 'schedule':     return Schedule(c)
    case 'textblock':    return TextBlock(c)
    default:             return Fallback(c)
  }
}

const bar = (c: Colors, w: string, h = 6) => (
  <div style={{ width: w, height: h, background: c.text, opacity: 0.85, borderRadius: 2 }} />
)
const barMuted = (c: Colors, w: string, h = 4) => (
  <div style={{ width: w, height: h, background: c.text, opacity: 0.35, borderRadius: 2 }} />
)
const pill = (c: Colors, w = 60, h = 16) => (
  <div data-wireframe-accent style={{ width: w, height: h, background: c.accent, borderRadius: 999 }} />
)

function Hero(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
      {bar(c, '70%', 10)}
      {bar(c, '55%', 10)}
      <div style={{ height: 6 }} />
      {barMuted(c, '60%')}
      {barMuted(c, '45%')}
      <div style={{ height: 8 }} />
      {pill(c, 80, 18)}
    </div>
  )
}

function Features(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>{bar(c, '40%', 8)}</div>
      <div style={{ display: 'flex', gap: 10, flex: 1, marginTop: 4 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', padding: 6 }}>
            <div data-wireframe-accent style={{ width: 14, height: 14, borderRadius: 999, background: c.accent }} />
            {bar(c, '70%', 5)}
            {barMuted(c, '90%', 3)}
            {barMuted(c, '60%', 3)}
          </div>
        ))}
      </div>
    </div>
  )
}

function About(c: Colors) {
  return (
    <div style={{ flex: 1, display: 'flex', gap: 12, padding: 16 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
        {barMuted(c, '40%', 4)}
        {bar(c, '85%', 8)}
        {bar(c, '60%', 8)}
        <div style={{ height: 4 }} />
        {barMuted(c, '95%', 3)}
        {barMuted(c, '85%', 3)}
        {barMuted(c, '70%', 3)}
      </div>
      <div style={{ flex: 1, background: c.text, opacity: 0.2, borderRadius: 4 }} />
    </div>
  )
}

function Cta(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        background: c.accent + '22', borderRadius: 8, padding: 16,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '80%',
      }}>
        {bar(c, '60%', 8)}
        {barMuted(c, '70%', 4)}
        <div style={{ height: 4 }} />
        {pill(c, 70, 16)}
      </div>
    </div>
  )
}

function Faq(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>{bar(c, '40%', 8)}</div>
      {[0,1,2].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', border: `1px solid ${c.text}22`, borderRadius: 4 }}>
          {bar(c, '60%', 5)}
          <span style={{ color: c.text, opacity: 0.5, fontSize: 10 }}>›</span>
        </div>
      ))}
    </div>
  )
}

function Pricing(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>{bar(c, '40%', 8)}</div>
      <div style={{ display: 'flex', gap: 6, flex: 1 }}>
        {[0,1,2].map(i => (
          <div key={i} data-wireframe-accent={i === 1 ? '' : undefined} style={{
            flex: 1,
            border: `${i === 1 ? '2px' : '1px'} solid ${i === 1 ? c.accent : c.text + '22'}`,
            background: i === 1 ? c.accent : 'transparent',
            borderRadius: 6, padding: 8,
            display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center',
            opacity: i === 1 ? 0.95 : 1,
          }}>
            {bar(c, '50%', 4)}
            {bar(c, '70%', 10)}
            {barMuted(c, '60%', 3)}
            {barMuted(c, '50%', 3)}
          </div>
        ))}
      </div>
    </div>
  )
}

function Testimonials(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>{bar(c, '40%', 8)}</div>
      <div style={{ display: 'flex', gap: 10, flex: 1 }}>
        {[0,1].map(i => (
          <div key={i} style={{
            flex: 1, border: `1px solid ${c.text}22`, borderRadius: 6, padding: 8,
            display: 'flex', flexDirection: 'column', gap: 4, position: 'relative',
          }}>
            <span style={{ position: 'absolute', top: 2, left: 6, color: c.accent, fontSize: 16, lineHeight: 1 }}>&ldquo;</span>
            <div style={{ height: 10 }} />
            {barMuted(c, '90%', 3)}
            {barMuted(c, '70%', 3)}
            <div style={{ height: 4 }} />
            {bar(c, '40%', 4)}
          </div>
        ))}
      </div>
    </div>
  )
}

function Stats(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 16, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div data-wireframe-accent style={{ width: 40, height: 14, background: c.accent, borderRadius: 2 }} />
          {barMuted(c, '50px', 3)}
        </div>
      ))}
    </div>
  )
}

function Gallery(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 10, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 6 }}>
      {[0,1,2,3,4,5].map(i => <div key={i} style={{ background: c.text, opacity: 0.15, borderRadius: 4 }} />)}
    </div>
  )
}

function Menu(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {bar(c, '40%', 8)}
      {[0,1,2,3].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {bar(c, '40%', 4)}
          <div style={{ flex: 1, borderBottom: `1px dashed ${c.text}33`, marginTop: -2 }} />
          {bar(c, '12%', 4)}
        </div>
      ))}
    </div>
  )
}

function Products(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 10, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ flex: 1, background: c.text, opacity: 0.15, borderRadius: 4 }} />
          {bar(c, '70%', 4)}
          <div data-wireframe-accent style={{ width: 30, height: 6, background: c.accent, borderRadius: 2 }} />
        </div>
      ))}
    </div>
  )
}

function Schedule(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 5 }}>
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div data-wireframe-accent style={{ width: 6, height: 6, borderRadius: 999, background: c.accent }} />
          {bar(c, '25%', 4)}
          {barMuted(c, '50%', 3)}
        </div>
      ))}
    </div>
  )
}

function LinkList(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: 999, background: c.text, opacity: 0.2 }} />
      {bar(c, '40%', 5)}
      {[0,1,2,3].map(i => (
        <div key={i} style={{ width: '70%', height: 12, borderRadius: 999, border: `1px solid ${c.text}33` }} />
      ))}
    </div>
  )
}

function Articles(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ width: 32, height: 24, background: c.text, opacity: 0.15, borderRadius: 3 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {bar(c, '70%', 4)}
            {barMuted(c, '90%', 3)}
          </div>
        </div>
      ))}
    </div>
  )
}

function TextBlock(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
      {barMuted(c, '85%', 3)}
      {barMuted(c, '90%', 3)}
      {barMuted(c, '75%', 3)}
      {barMuted(c, '88%', 3)}
      {barMuted(c, '60%', 3)}
    </div>
  )
}

function Contact(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width: '100%', height: 14, border: `1px solid ${c.text}33`, borderRadius: 3 }} />
      ))}
      <div data-wireframe-accent style={{ alignSelf: 'flex-start', width: 70, height: 16, background: c.accent, borderRadius: 999, marginTop: 4 }} />
    </div>
  )
}

function Fallback(c: Colors) {
  return (
    <div style={{ flex: 1, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div data-wireframe-accent style={{
        padding: '8px 14px', border: `2px dashed ${c.accent}`, borderRadius: 6, color: c.text, fontSize: 10, opacity: 0.6,
        background: c.accent,
      }}>
        block
      </div>
    </div>
  )
}
