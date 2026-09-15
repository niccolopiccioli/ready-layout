/**
 * Controllo completo per ogni sezione: posizione, larghezza, allineamento testo,
 * padding verticale, bordi (on/off + colore + spessore + raggio + posizione),
 * ombra e visibilità.
 *
 * I valori vivono dentro `values[sectionId]` con chiavi riservate `_s*`,
 * quindi funzionano con updateField/persistenza/export esistenti senza
 * toccare gli schemi dei template.
 */

export type SectionAlign = 'left' | 'center' | 'right'
export type SectionTextAlign = 'auto' | 'left' | 'center' | 'right'
export type SectionWidth = 'full' | 'xl' | 'lg' | 'md' | 'sm'
export type SectionPaddingY = 'none' | 'sm' | 'md' | 'lg' | 'xl'
export type SectionBorderPosition = 'all' | 'top' | 'bottom'
export type SectionBorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full'

export interface SectionStyle {
  align: SectionAlign
  width: SectionWidth
  textAlign: SectionTextAlign
  paddingY: SectionPaddingY
  borderEnabled: boolean
  borderColor: string
  borderWidth: number
  borderPosition: SectionBorderPosition
  borderRadius: SectionBorderRadius
  shadow: boolean
  hidden: boolean
}

export const SECTION_STYLE_DEFAULTS: SectionStyle = {
  align: 'center',
  width: 'full',
  textAlign: 'auto',
  paddingY: 'none',
  borderEnabled: false,
  borderColor: '#00e5ff',
  borderWidth: 1,
  borderPosition: 'all',
  borderRadius: 'lg',
  shadow: false,
  hidden: false,
}

/** Chiavi riservate dentro values[sectionId] */
export const SECTION_STYLE_KEYS = {
  align: '_sAlign',
  width: '_sWidth',
  textAlign: '_sTextAlign',
  paddingY: '_sPaddingY',
  borderEnabled: '_sBorder',
  borderColor: '_sBorderColor',
  borderWidth: '_sBorderWidth',
  borderPosition: '_sBorderPos',
  borderRadius: '_sRadius',
  shadow: '_sShadow',
  hidden: '_sHidden',
} as const

function pick<T extends string>(
  raw: unknown,
  allowed: readonly T[],
  fallback: T
): T {
  return typeof raw === 'string' && (allowed as readonly string[]).includes(raw)
    ? (raw as T)
    : fallback
}

function pickBool(raw: unknown, fallback: boolean): boolean {
  return typeof raw === 'boolean' ? raw : fallback
}

function pickNum(raw: unknown, min: number, max: number, fallback: number): number {
  const n = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, Math.round(n)))
}

function pickColor(raw: unknown, fallback: string): string {
  return typeof raw === 'string' && raw.trim().length > 0 ? raw : fallback
}

/** Legge lo stile normalizzato (con default) dai valori di una sezione. */
export function getSectionStyle(
  sectionValues: Record<string, unknown> | undefined | null
): SectionStyle {
  const v = sectionValues ?? {}
  const K = SECTION_STYLE_KEYS
  return {
    align: pick(v[K.align], ['left', 'center', 'right'] as const, SECTION_STYLE_DEFAULTS.align),
    width: pick(v[K.width], ['full', 'xl', 'lg', 'md', 'sm'] as const, SECTION_STYLE_DEFAULTS.width),
    textAlign: pick(
      v[K.textAlign],
      ['auto', 'left', 'center', 'right'] as const,
      SECTION_STYLE_DEFAULTS.textAlign
    ),
    paddingY: pick(
      v[K.paddingY],
      ['none', 'sm', 'md', 'lg', 'xl'] as const,
      SECTION_STYLE_DEFAULTS.paddingY
    ),
    borderEnabled: pickBool(v[K.borderEnabled], false),
    borderColor: pickColor(v[K.borderColor], SECTION_STYLE_DEFAULTS.borderColor),
    borderWidth: pickNum(v[K.borderWidth], 1, 8, SECTION_STYLE_DEFAULTS.borderWidth),
    borderPosition: pick(
      v[K.borderPosition],
      ['all', 'top', 'bottom'] as const,
      SECTION_STYLE_DEFAULTS.borderPosition
    ),
    borderRadius: pick(
      v[K.borderRadius],
      ['none', 'sm', 'md', 'lg', 'full'] as const,
      SECTION_STYLE_DEFAULTS.borderRadius
    ),
    shadow: pickBool(v[K.shadow], false),
    hidden: pickBool(v[K.hidden], false),
  }
}

/** True se lo stile è tutto ai default (niente override visivo). */
export function isDefaultSectionStyle(style: SectionStyle): boolean {
  const d = SECTION_STYLE_DEFAULTS
  return (
    style.align === d.align &&
    style.width === d.width &&
    style.textAlign === d.textAlign &&
    style.paddingY === d.paddingY &&
    style.borderEnabled === false &&
    style.shadow === false &&
    style.hidden === false
  )
}

export const SECTION_WIDTH_PX: Record<SectionWidth, string> = {
  full: '100%',
  xl: '72rem',
  lg: '64rem',
  md: '48rem',
  sm: '36rem',
}

export const SECTION_PADDING_PX: Record<SectionPaddingY, string> = {
  none: '0px',
  sm: '16px',
  md: '32px',
  lg: '56px',
  xl: '88px',
}

export const SECTION_RADIUS_PX: Record<SectionBorderRadius, string> = {
  none: '0px',
  sm: '8px',
  md: '14px',
  lg: '22px',
  full: '999px',
}
