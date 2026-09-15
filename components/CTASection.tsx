'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Terminal } from 'lucide-react'

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); io.disconnect() } }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="lancio" className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
      <div
        ref={ref}
        className="reveal relative overflow-hidden rounded-[28px] px-7 sm:px-14 py-14 sm:py-20 text-center border border-white/10"
        style={{ background: 'linear-gradient(135deg, #00181d 0%, #0b0b1e 45%, #1e0b2e 100%)' }}
      >
        <div className="absolute inset-0 rl-grid-bg opacity-70" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-[320px] rounded-full animate-pulse-glow" style={{ background: 'radial-gradient(closest-side, rgba(0,229,255,0.3), transparent)', filter: 'blur(30px)' }} />
        <div className="absolute top-5 left-6 flex gap-1.5">
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
        </div>
        <div className="absolute top-4 right-6 font-hud text-[9px] tracking-[0.28em] text-white/30 hidden sm:flex items-center gap-2">
          <Terminal size={12} /> DEPLOY_SEQUENCE // READY
        </div>

        <div className="relative z-10">
          <div className="rl-chip mb-6 mx-auto"><span className="dot" /> SEQUENZA DI LANCIO</div>
          <h2 className="font-display font-black text-white tracking-tight leading-[0.95] mx-auto" style={{ fontSize: 'clamp(32px,5.4vw,62px)' }}>
            Il tuo sito decolla<br />in <span className="rl-neon-text">meno di 60 secondi.</span>
          </h2>
          <p className="text-[15px] sm:text-[16px] text-white/55 max-w-lg mx-auto mt-5 leading-relaxed">
            Nessun setup. Nessun deploy. Solo template, editor visuale ed export. Il resto è velocità luce.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-9">
            <Link href="#templates" className="rl-btn-primary ed-press rounded-2xl px-9 py-4 text-[13px] font-bold inline-flex items-center gap-2 font-display" style={{ letterSpacing: '0.04em' }}>
              LANCIA ORA <ArrowRight size={16} strokeWidth={2.6} />
            </Link>
            <div className="rl-glass rounded-2xl px-6 py-4 font-hud text-[11px] text-white/50 hidden sm:flex items-center gap-3">
              <span className="text-emerald-400">●</span> 0 RIGHE DI CODICE RICHIESTE
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
