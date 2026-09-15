'use client'

import type { ReactNode } from 'react'
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Expand,
  EyeOff,
  Eye,
  Layers,
  Sun,
  RotateCcw,
} from 'lucide-react'
import { cssColorToHex } from '@/lib/colorUtils'
import {
  SECTION_STYLE_KEYS,
  getSectionStyle,
  isDefaultSectionStyle,
  type SectionAlign,
  type SectionBorderPosition,
  type SectionBorderRadius,
  type SectionPaddingY,
  type SectionTextAlign,
  type SectionWidth,
} from '@/lib/section-style'

interface SectionStyleControlsProps {
  values: Record<string, unknown>
  onStyleChange: (fieldId: string, value: unknown) => void
}

const K = SECTION_STYLE_KEYS

export function SectionStyleControls({ values, onStyleChange }: SectionStyleControlsProps) {
  const style = getSectionStyle(values)
  const isDefault = isDefaultSectionStyle(style)

  const resetStyle = () => {
    onStyleChange(K.align, 'center')
    onStyleChange(K.width, 'full')
    onStyleChange(K.textAlign, 'auto')
    onStyleChange(K.paddingY, 'none')
    onStyleChange(K.borderEnabled, false)
    onStyleChange(K.borderColor, '#00e5ff')
    onStyleChange(K.borderWidth, 1)
    onStyleChange(K.borderPosition, 'all')
    onStyleChange(K.borderRadius, 'lg')
    onStyleChange(K.shadow, false)
    onStyleChange(K.hidden, false)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* header riga con reset */}
      <div className="flex items-center justify-between">
        <span className="font-hud text-[8px] tracking-[0.2em] text-white/35 uppercase">
          {style.hidden
            ? 'Nascosta in preview'
            : style.width === 'full'
              ? 'A tutta larghezza'
              : `${style.width.toUpperCase()} · ${style.align === 'left' ? 'a sinistra' : style.align === 'right' ? 'a destra' : 'centrata'}`}
        </span>
        {!isDefault && (
          <button
            onClick={resetStyle}
            title="Ripristina stile default"
            className="ed-press inline-flex items-center gap-1 font-hud text-[9px] tracking-[0.14em] text-white/40 hover:text-cyan-300"
          >
            <RotateCcw size={11} /> RESET
          </button>
        )}
      </div>

      {/* ── Posizione orizzontale ── */}
      <Control label="Posizione sezione">
        <Seg<SectionAlign>
          value={style.align}
          onPick={(v) => onStyleChange(K.align, v)}
          options={[
            { value: 'left', label: 'Sinistra', icon: <AlignLeft size={14} /> },
            { value: 'center', label: 'Centro', icon: <AlignCenter size={14} /> },
            { value: 'right', label: 'Destra', icon: <AlignRight size={14} /> },
          ]}
        />
        <Hint>Visibile quando la larghezza non è “Intera”.</Hint>
      </Control>

      {/* ── Larghezza ── */}
      <Control label="Larghezza contenuto">
        <Seg<SectionWidth>
          value={style.width}
          onPick={(v) => onStyleChange(K.width, v)}
          options={[
            { value: 'full', label: 'Intera', icon: <Expand size={13} /> },
            { value: 'xl', label: 'XL' },
            { value: 'lg', label: 'LG' },
            { value: 'md', label: 'MD' },
            { value: 'sm', label: 'SM' },
          ]}
        />
      </Control>

      {/* ── Allineamento testo ── */}
      <Control label="Allineamento testo">
        <Seg<SectionTextAlign>
          value={style.textAlign}
          onPick={(v) => onStyleChange(K.textAlign, v)}
          options={[
            { value: 'auto', label: 'Auto', icon: <Sparkles size={13} /> },
            { value: 'left', label: 'Sx', icon: <AlignLeft size={14} /> },
            { value: 'center', label: 'Centro', icon: <AlignCenter size={14} /> },
            { value: 'right', label: 'Dx', icon: <AlignRight size={14} /> },
          ]}
        />
        <Hint>Vince su qualsiasi centratura del template.</Hint>
      </Control>

      {/* ── Padding verticale ── */}
      <Control label="Respiro verticale">
        <Seg<SectionPaddingY>
          value={style.paddingY}
          onPick={(v) => onStyleChange(K.paddingY, v)}
          options={[
            { value: 'none', label: '0' },
            { value: 'sm', label: 'S' },
            { value: 'md', label: 'M' },
            { value: 'lg', label: 'L' },
            { value: 'xl', label: 'XL' },
          ]}
        />
      </Control>

      {/* ── Bordo ── */}
      <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
        <ToggleRow
          icon={<Layers size={13} />}
          label="Bordo sezione"
          hint={style.borderEnabled ? 'Attivo' : 'Spento'}
          checked={style.borderEnabled}
          onToggle={() => onStyleChange(K.borderEnabled, !style.borderEnabled)}
        />
        {style.borderEnabled && (
          <div className="mt-3 flex flex-col gap-3 border-t border-white/8 pt-3">
            <div className="flex items-center gap-3">
              <div
                className="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/15"
                style={{ boxShadow: `0 0 16px ${style.borderColor}44` }}
                title="Colore bordo"
              >
                <div className="absolute inset-0" style={{ backgroundColor: style.borderColor }} />
                <input
                  type="color"
                  value={cssColorToHex(style.borderColor)}
                  onChange={(e) => onStyleChange(K.borderColor, e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Colore bordo"
                />
              </div>
              <input
                type="text"
                value={style.borderColor}
                onChange={(e) => onStyleChange(K.borderColor, e.target.value)}
                className="ed-input font-mono"
                style={{ fontSize: 12, padding: '6px 9px' }}
                spellCheck={false}
                aria-label="Valore colore bordo"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-hud text-[8px] uppercase tracking-[0.2em] text-white/40">
                  Spessore
                </span>
                <span className="font-hud text-[10px] tabular-nums text-cyan-300">
                  {style.borderWidth}px
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={style.borderWidth}
                onChange={(e) => onStyleChange(K.borderWidth, Number(e.target.value))}
                className="w-full"
                style={{ accentColor: '#00e5ff' }}
                aria-label="Spessore bordo"
              />
            </div>

            <div>
              <div className="font-hud mb-1.5 text-[8px] uppercase tracking-[0.2em] text-white/40">
                Lati
              </div>
              <Seg<SectionBorderPosition>
                value={style.borderPosition}
                onPick={(v) => onStyleChange(K.borderPosition, v)}
                options={[
                  { value: 'all', label: 'Tutto' },
                  { value: 'top', label: 'Sopra' },
                  { value: 'bottom', label: 'Sotto' },
                ]}
              />
            </div>

            <div>
              <div className="font-hud mb-1.5 text-[8px] uppercase tracking-[0.2em] text-white/40">
                Angoli
              </div>
              <Seg<SectionBorderRadius>
                value={style.borderRadius}
                onPick={(v) => onStyleChange(K.borderRadius, v)}
                options={[
                  { value: 'none', label: 'No' },
                  { value: 'sm', label: 'S' },
                  { value: 'md', label: 'M' },
                  { value: 'lg', label: 'L' },
                  { value: 'full', label: 'Pill' },
                ]}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Ombra + visibilità ── */}
      <div className="flex flex-col gap-2">
        <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
          <ToggleRow
            icon={<Sun size={13} />}
            label="Ombra morbida"
            hint="Profondità"
            checked={style.shadow}
            onToggle={() => onStyleChange(K.shadow, !style.shadow)}
          />
        </div>
        <div
          className="rounded-xl border p-3"
          style={
            style.hidden
              ? { borderColor: 'rgba(255,150,80,0.4)', background: 'rgba(255,150,80,0.06)' }
              : { borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.025)' }
          }
        >
          <ToggleRow
            icon={style.hidden ? <EyeOff size={13} /> : <Eye size={13} />}
            label={style.hidden ? 'Sezione nascosta' : 'Sezione visibile'}
            hint={style.hidden ? 'Off in preview' : 'On'}
            checked={!style.hidden}
            onToggle={() => onStyleChange(K.hidden, !style.hidden)}
          />
        </div>
      </div>
    </div>
  )
}

/* ── primitives ── */

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="ed-label">{label}</span>
      {children}
    </div>
  )
}

function Hint({ children }: { children: ReactNode }) {
  return <span className="text-[11px] leading-snug text-white/35">{children}</span>
}

interface SegOption<T extends string> {
  value: T
  label: string
  icon?: ReactNode
}

function Seg<T extends string>({
  value,
  onPick,
  options,
}: {
  value: T
  onPick: (v: T) => void
  options: SegOption<T>[]
}) {
  return (
    <div
      role="radiogroup"
      className="grid gap-1 rounded-xl border border-white/8 bg-black/30 p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            title={opt.label}
            onClick={() => onPick(opt.value)}
            className="ed-press flex min-h-[38px] flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[11px] font-bold"
            style={
              active
                ? {
                    background: 'linear-gradient(135deg,#00e5ff,#4f7cff)',
                    color: '#02060a',
                    boxShadow: '0 2px 14px rgba(0,229,255,0.35)',
                  }
                : { color: 'rgba(255,255,255,0.55)' }
            }
          >
            {opt.icon}
            <span className="leading-none">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function ToggleRow({
  icon,
  label,
  hint,
  checked,
  onToggle,
}: {
  icon: ReactNode
  label: string
  hint: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button onClick={onToggle} aria-pressed={checked} className="ed-press flex w-full items-center gap-2.5 text-left">
      <span
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border"
        style={
          checked
            ? { borderColor: 'rgba(0,229,255,0.4)', background: 'rgba(0,229,255,0.12)', color: '#7df3ff' }
            : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)' }
        }
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-white/85">{label}</span>
        <span className="block font-hud text-[8px] uppercase tracking-[0.2em] text-white/35">{hint}</span>
      </span>
      <span
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
        style={{ background: checked ? 'linear-gradient(135deg,#00e5ff,#4f7cff)' : 'rgba(255,255,255,0.12)' }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
          style={{ left: checked ? 22 : 2, boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
        />
      </span>
    </button>
  )
}
