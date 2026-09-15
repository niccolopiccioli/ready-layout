'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { postToParent, postToWindow } from '@/lib/editor-messaging'

interface SectionInserterProps {
  insertAfterId: string | null
}

export function SectionInserter({ insertAfterId }: SectionInserterProps) {
  const [hover, setHover] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
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
      style={{ position: 'relative', height: hover ? 46 : 10, transition: 'height .18s cubic-bezier(.23,1,.32,1)', cursor: 'pointer', zIndex: 15 }}
      onClick={handleClick}
    >
      <div style={{
        position: 'absolute', left: 32, right: 32, top: '50%', height: 2, borderRadius: 99,
        background: 'linear-gradient(90deg, transparent, #00e5ff 20%, #7c3aed 50%, #ff2ea6 80%, transparent)',
        opacity: hover ? 1 : 0, transition: 'opacity .18s', pointerEvents: 'none',
        boxShadow: '0 0 14px rgba(0,229,255,0.5)',
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%,-50%) scale(${hover ? 1 : 0.85})`,
        display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px 7px 10px', borderRadius: 99,
        background: '#06060d', border: '1px solid rgba(0,229,255,0.5)', color: '#7df3ff',
        fontSize: 11.5, fontWeight: 800, letterSpacing: '0.08em', whiteSpace: 'nowrap',
        opacity: hover ? 1 : 0, transition: 'all .18s', pointerEvents: 'none',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 20px rgba(0,229,255,0.25)',
      }}>
        <span style={{ width: 20, height: 20, borderRadius: 99, background: 'linear-gradient(135deg,#00e5ff,#7c3aed)', display: 'grid', placeItems: 'center' }}>
          <Plus size={13} strokeWidth={3} color="#02060a" />
        </span>
        INSERISCI MODULO
      </div>
    </div>
  )
}
