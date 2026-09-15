'use client'

import { useEffect, useRef } from 'react'
import { MousePointerClick, Move3d, Palette, Rocket } from 'lucide-react'

const features = [
  {
    icon: MousePointerClick,
    tag: '01 / INLINE',
    title: 'Clicca. Scrivi. Fatto.',
    desc: 'Ogni testo e immagine si edita direttamente sul canvas. Tiptap fluttua sopra l’elemento, salvi con ⌘↵.',
    accent: '#00e5ff',
  },
  {
    icon: Move3d,
    tag: '02 / PHYSICS',
    title: 'Drag & drop magnetico',
    desc: 'Riordina sezioni e card con handle al plasma, inserter luminosi e undo infinito a ogni mossa.',
    accent: '#a78bfa',
  },
  {
    icon: Palette,
    tag: '03 / MATTER',
    title: 'Temi, font, materia',
    desc: '6 temi preimpostati, 18 font, palette random olografiche. Un click e l’intero sito cambia pelle.',
    accent: '#ff2ea6',
  },
  {
    icon: Rocket,
    tag: '04 / LAUNCH',
    title: 'Preview → Export → Via',
    desc: 'Anteprima device reale, sync istantaneo editor/canvas, export JSON pronto per il decollo.',
    accent: '#c8ff00',
  },
]

export function FeatureSection() {
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section id="sistema" className="relative w-full px-4 sm:px-8 py-24 sm:py-32">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <div className="rl-chip mb-5"><span className="dot" /> IL SISTEMA</div>
          <h2 className="font-display font-black text-white tracking-tight leading-[0.95]" style={{ fontSize: 'clamp(34px,5vw,60px)' }}>
            Un motore.<br /><span className="rl-neon-text">Quattro superpoteri.</span>
          </h2>
        </div>
        <p className="max-w-xs text-[14px] leading-relaxed text-white/50">
          Niente pannelli grigi. Un cockpit scuro, HUD in mono, feedback aptico su ogni azione.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {features.map((f, i) => {
          const Icon = f.icon
          return (
            <div
              key={f.tag}
              ref={(el) => { refs.current[i] = el }}
              className="reveal rl-card group overflow-hidden p-7 sm:p-8 transition-all duration-500 hover:-translate-y-1.5"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(closest-side, ${f.accent}33, transparent)`, filter: 'blur(20px)' }} />
              <div className="flex items-start justify-between mb-8">
                <span className="w-12 h-12 rounded-2xl grid place-items-center border border-white/10" style={{ background: `${f.accent}14`, color: f.accent, boxShadow: `0 0 24px ${f.accent}33` }}>
                  <Icon size={21} strokeWidth={2.2} />
                </span>
                <span className="font-hud text-[10px] tracking-[0.24em] text-white/30">{f.tag}</span>
              </div>
              <h3 className="font-display font-bold text-white text-[22px] tracking-tight mb-2.5">{f.title}</h3>
              <p className="text-[14px] leading-relaxed text-white/55">{f.desc}</p>
              <div className="mt-7 h-px w-full bg-white/8 relative overflow-hidden rounded-full">
                <div className="absolute inset-y-0 left-0 w-1/3 rounded-full transition-all duration-700 group-hover:w-full" style={{ background: `linear-gradient(90deg, transparent, ${f.accent})` }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
