'use client'

import { useState } from 'react'
import { postToParent, postToWindow } from '@/lib/editor-messaging'

interface SectionInserterProps {
  insertAfterId: string | null
}

export function SectionInserter({ insertAfterId }: SectionInserterProps) {
  const [hover, setHover] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Inside iframe canvas: post to parent. If somehow rendered in parent
    // (no parent != self), this still posts to itself and is harmless.
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      postToParent({ type: 'readylayout-open-picker', insertAfterId })
    } else if (typeof window !== 'undefined') {
      postToWindow({ type: 'readylayout-open-picker', insertAfterId })
    }
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        height: hover ? 40 : 8,
        transition: 'height var(--dur-hover) var(--ease-out)',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: '50%',
          height: 1,
          background: 'var(--ed-accent)',
          opacity: hover ? 1 : 0,
          transition: 'opacity var(--dur-hover) var(--ease-out)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '4px 14px',
          borderRadius: 999,
          background: 'var(--ed-accent)',
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          opacity: hover ? 1 : 0,
          transition: 'opacity var(--dur-hover) var(--ease-out)',
          pointerEvents: 'none',
          boxShadow: '0 2px 6px -1px rgb(0 0 0 / 0.2)',
        }}
      >
        + Aggiungi sezione
      </div>
    </div>
  )
}
