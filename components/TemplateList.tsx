'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, ArrowUpRight, Filter } from 'lucide-react'
import { TemplateThumb } from './TemplateThumb'

interface TemplateMeta {
  id: string
  name: string
  description?: string
  category?: string
  accentColor: string
  bgColor: string
}

const categoryLabel: Record<string, string> = {
  landing: 'Landing',
  portfolio: 'Portfolio',
  commerce: 'Commerce',
  content: 'Content',
  event: 'Event',
  personal: 'Personal',
}

export function TemplateList({ templates }: { templates: TemplateMeta[] }) {
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const gridRef = useRef<HTMLUListElement>(null)

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(templates.map((t) => t.category).filter(Boolean) as string[]))],
    [templates]
  )

  const filtered = templates.filter((t) => {
    if (cat !== 'all' && t.category !== cat) return false
    if (q && !(`${t.name} ${t.description ?? ''}`.toLowerCase().includes(q.toLowerCase()))) return false
    return true
  })

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const cards = el.querySelectorAll<HTMLElement>('.template-card')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [filtered])

  return (
    <div>
      {/* command bar */}
      <div className="rl-glass rounded-2xl p-3 mb-8 flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="flex items-center gap-3 flex-1 rounded-xl px-4 py-3 border border-white/8 bg-black/30 min-w-0">
          <Search size={16} className="text-cyan-300/70 shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca template… (portfolio, bistro, shop)"
            className="bg-transparent outline-none flex-1 text-[14px] text-white placeholder:text-white/30 min-w-0"
          />
          {q && (
            <button onClick={() => setQ('')} className="font-hud text-[10px] tracking-[0.2em] text-white/40 hover:text-white">ESC</button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
          <Filter size={13} className="text-white/30 shrink-0 ml-1" />
          {categories.map((c) => {
            const active = c === cat
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="ed-press shrink-0 px-4 py-2.5 rounded-xl font-display text-[11px] font-bold tracking-[0.06em] uppercase border transition-all"
                style={
                  active
                    ? { background: 'linear-gradient(135deg,#00e5ff,#7c3aed)', color: '#02060a', borderColor: 'transparent', fontWeight: 800, boxShadow: '0 4px 20px rgba(0,229,255,0.35)' }
                    : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)', borderColor: 'rgba(255,255,255,0.08)' }
                }
              >
                {c === 'all' ? `Tutti · ${templates.length}` : (categoryLabel[c] ?? c)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="font-hud text-[10px] tracking-[0.24em] text-white/35 mb-5 flex items-center justify-between">
        <span>{filtered.length} MODULI TROVATI — SELEZIONA PER INIZIALIZZARE</span>
        <span className="hidden sm:inline text-cyan-300/50">◉ LIVE RENDER</span>
      </div>

      {filtered.length === 0 ? (
        <div className="rl-card p-14 text-center">
          <div className="font-display font-bold text-white text-xl mb-2">Nessun modulo trovato</div>
          <p className="text-white/50 text-sm">Prova a resettare filtri o ricerca.</p>
          <button onClick={() => { setQ(''); setCat('all') }} className="rl-btn-primary ed-press rounded-xl px-6 py-3 text-[12px] font-bold mt-6 font-display" style={{ letterSpacing: '0.04em' }}>RESET FILTRI</button>
        </div>
      ) : (
        <ul ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filtered.map((t, i) => (
            <li key={t.id} className="template-card reveal" style={{ transitionDelay: `${Math.min(i * 45, 280)}ms`, listStyle: 'none' }}>
              <Link href={`/editor/${t.id}`} className="group rl-card flex flex-col overflow-hidden hover:-translate-y-1.5 hover:scale-[1.01] transition-all duration-500">
                <TemplateThumb templateId={t.id} accent={t.accentColor} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className="font-hud text-[10px] text-white/30 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-hud text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border border-white/10 text-white/55 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.accentColor, boxShadow: `0 0 8px ${t.accentColor}` }} />
                      {categoryLabel[t.category ?? ''] ?? t.category}
                    </span>
                    <ArrowUpRight size={16} className="ml-auto text-white/25 group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <h3 className="font-display font-bold text-white text-[19px] tracking-tight leading-tight mb-1.5">{t.name}</h3>
                  {t.description && <p className="text-[13px] leading-relaxed text-white/50 line-clamp-2 mb-4">{t.description}</p>}
                  <div className="flex items-center gap-2 pt-4 border-t border-white/8">
                    <span className="flex -space-x-1.5">
                      {[t.accentColor, '#7c3aed', '#ff2ea6'].map((c) => (
                        <span key={c} className="w-4 h-4 rounded-full border-2 border-[#0b0b14]" style={{ background: c }} />
                      ))}
                    </span>
                    <span className="font-hud text-[9px] tracking-[0.2em] text-white/35">READY TO FORK</span>
                    <span className="ml-auto font-hud text-[10px] font-bold tracking-[0.14em] text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">OPEN EDITOR →</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
