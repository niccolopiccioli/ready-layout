'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, Zap, Command, Layers } from 'lucide-react'

export function HeroSection() {
  const [mounted] = useState(true)
  const [counts, setCounts] = useState([0, 0, 0])
  const targets = [31, 10, 100]

  useEffect(() => {
    const start = performance.now()
    const dur = 1800
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      setCounts(targets.map((v) => Math.round(v * eased)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden rl-void-bg rl-noise">
      {/* grid + orbs + scanline */}
      <div className="absolute inset-0 rl-grid-bg" />
      <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[900px] h-[480px] rounded-full animate-pulse-glow" style={{ background: 'radial-gradient(closest-side, rgba(0,229,255,0.22), transparent)', filter: 'blur(20px)' }} />
      <div className="absolute top-1/3 -left-40 w-[440px] h-[440px] rounded-full animate-float" style={{ background: 'radial-gradient(closest-side, rgba(124,58,237,0.35), transparent)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-0 -right-40 w-[520px] h-[520px] rounded-full animate-float-delayed" style={{ background: 'radial-gradient(closest-side, rgba(255,46,166,0.22), transparent)', filter: 'blur(70px)' }} />
      <div className="absolute left-0 right-0 h-px pointer-events-none" style={{ animation: 'scan-y 7s linear infinite', background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), transparent)', boxShadow: '0 0 24px rgba(0,229,255,0.4)' }} />

      {/* ── NAV ── */}
      <nav className="relative z-20 w-full max-w-6xl self-center mx-auto grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 pt-6 gap-4">
        <div className="flex items-center gap-3 justify-self-start">
          <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: 'linear-gradient(135deg,#00e5ff,#7c3aed)', boxShadow: '0 0 24px rgba(0,229,255,0.45)' }}>
            <Layers className="w-4.5 h-4.5 text-black" size={18} strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <div className="font-display font-extrabold text-white text-[17px] tracking-tight">READY<span className="rl-neon-text">LAYOUT</span></div>
            <div className="font-hud text-[8px] tracking-[0.32em] text-cyan-300/70 mt-1">NO-CODE ENGINE — V.2</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-9 justify-self-center font-hud text-[17px] font-extrabold tracking-[0.1em] text-white">
          <a href="#sistema" className="hover:text-cyan-300 transition-colors">SISTEMA</a>
          <a href="#templates" className="hover:text-cyan-300 transition-colors">TEMPLATE</a>
          <a href="#lancio" className="hover:text-cyan-300 transition-colors">LANCIO</a>
        </div>
        <Link href="#templates" className="rl-btn-primary ed-press rounded-xl px-5 py-2.5 text-[12px] font-bold inline-flex items-center gap-2 justify-self-end font-display" style={{ letterSpacing: '0.04em' }}>
          <Zap size={14} strokeWidth={2.5} /> INIZIA ORA
        </Link>
      </nav>

      {/* ── HERO ── */}
      <div className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 flex flex-col items-center justify-center text-center pt-14 pb-10">
        <div className={`rl-chip mb-7 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="dot" /> LIVE — EDITOR VISUALE / 31 TEMPLATE
        </div>

        <h1 data-hero-locked className={`font-display font-black text-white leading-[0.92] tracking-tight transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ fontSize: 'clamp(48px, 9vw, 112px)', fontFamily: 'var(--font-sora-pinned), ui-sans-serif, system-ui, sans-serif' }}>
          COSTRUISCI
          <br />
          <span className="rl-stroke-text">FUTURI</span> <span className="rl-neon-text">DIGITALI</span>
        </h1>

        <p className={`max-w-xl text-[15px] sm:text-[17px] leading-relaxed mt-7 text-white/60 transition-all duration-700 delay-100 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          Scegli un template olografico, modificalo inline, trascina sezioni, cambia font e temi al plasma.
          Zero codice. Solo pura velocità creativa.
        </p>

        <div className={`flex flex-wrap items-center justify-center gap-3 mt-9 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <Link href="#templates" className="rl-btn-primary ed-press rounded-2xl px-8 py-4 text-[13px] font-bold inline-flex items-center gap-2.5 font-display" style={{ letterSpacing: '0.04em' }}>
            <Command size={16} strokeWidth={2.5} /> APRI IL CATALOGO
          </Link>
          <a href="#sistema" className="rl-btn-ghost ed-press rounded-2xl px-8 py-4 text-[13px] font-bold inline-flex items-center gap-2 text-white/85 font-display" style={{ letterSpacing: '0.04em' }}>
            Come funziona <ArrowDown size={15} />
          </a>
        </div>

        {/* HUD stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-12 w-full max-w-2xl">
          {[
            { v: counts[0], suffix: '', label: 'TEMPLATE PRONTI', accent: '#00e5ff' },
            { v: counts[1], suffix: '', label: 'BLOCCHI SISTEMA', accent: '#a78bfa' },
            { v: counts[2], suffix: '%', label: 'NO-CODE PURO', accent: '#ff2ea6' },
          ].map((s) => (
            <div key={s.label} className="rl-glass rounded-2xl px-4 py-5 relative overflow-hidden">
              <div className="absolute top-0 left-4 right-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)` }} />
              <div className="font-display font-black text-3xl sm:text-4xl text-white tabular-nums">{s.v}{s.suffix}</div>
              <div className="font-hud text-[9px] tracking-[0.22em] text-white/45 mt-2">{s.label}</div>
            </div>
          ))}
        </div>

        {/* terminal hint */}
        <div className="mt-8 font-hud text-[11px] text-white/35 tracking-wide hidden sm:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span><span className="text-cyan-300/80">$</span> readylayout --open catalogo --mode=visual</span>
          <span className="inline-block w-[7px] h-[14px] bg-cyan-300/70 animate-pulse" />
        </div>
      </div>

      {/* marquee */}
      <div className="relative z-10 border-y border-white/8 bg-black/40 backdrop-blur-md overflow-hidden py-3.5">
        <div className="flex whitespace-nowrap animate-marquee gap-0 w-max">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center gap-8 pr-8 font-hud text-[11px] tracking-[0.28em] text-white/40">
              {['HERO', 'FEATURES', 'PRICING', 'GALLERY', 'FAQ', 'CTA', 'PRODUCTS', 'TESTIMONIALS', 'STATS', 'MENU', 'SCHEDULE', 'DRAG & DROP', 'INLINE EDITING', 'LIVE PREVIEW'].map((w) => (
                <span key={w} className="flex items-center gap-8">
                  <span>{w}</span>
                  <span className="text-cyan-400/70">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
