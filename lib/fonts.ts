// ── NUOVO SISTEMA TIPOGRAFICO — totalmente diverso dal precedente ──
// Display: Unbounded (largo, futuristico) · Body: Chakra Petch + Exo 2 ·
// Brand: Orbitron · HUD mono: Share Tech Mono · Extra: Michroma, Audiowide, Oxanium, Saira

export const fontMap: Record<string, string> = {
  'unbounded': 'var(--font-unbounded)',
  'chakra': 'var(--font-chakra)',
  'exo2': 'var(--font-exo2)',
  'orbitron': 'var(--font-orbitron)',
  'michroma': 'var(--font-michroma)',
  'audiowide': 'var(--font-audiowide)',
  'oxanium': 'var(--font-oxanium)',
  'saira': 'var(--font-saira)',
  'sharetech': 'var(--font-sharetech)',
}

export const fontList = Object.keys(fontMap)

export const fontCategories = {
  sans: ['chakra', 'exo2', 'saira', 'oxanium'],
  display: ['unbounded', 'orbitron', 'michroma', 'audiowide'],
  mono: ['sharetech'],
}

export const DEFAULT_FONT = 'var(--font-chakra)'

/** Migra vecchi font salvati in localStorage verso il nuovo sistema. */
const LEGACY_FONT_ALIAS: Record<string, string> = {
  'var(--font-hanken)': 'var(--font-chakra)',
  'var(--font-inter)': 'var(--font-exo2)',
  'var(--font-manrope)': 'var(--font-chakra)',
  'var(--font-dm-sans)': 'var(--font-exo2)',
  'var(--font-outfit)': 'var(--font-saira)',
  'var(--font-plus-jakarta)': 'var(--font-exo2)',
  'var(--font-work-sans)': 'var(--font-saira)',
  'var(--font-rubik)': 'var(--font-saira)',
  'var(--font-space-grotesk)': 'var(--font-oxanium)',
  'var(--font-syne)': 'var(--font-orbitron)',
  'var(--font-sora)': 'var(--font-unbounded)',
  'var(--font-playfair)': 'var(--font-audiowide)',
  'var(--font-cormorant)': 'var(--font-audiowide)',
  'var(--font-lora)': 'var(--font-oxanium)',
  'var(--font-bebas-neue)': 'var(--font-michroma)',
  'var(--font-oswald)': 'var(--font-oxanium)',
  'var(--font-righteous)': 'var(--font-audiowide)',
  'var(--font-jetbrains)': 'var(--font-sharetech)',
  'var(--font-geist-mono)': 'var(--font-sharetech)',
}

export function migrateFontVar(v: string | null | undefined): string {
  if (!v) return DEFAULT_FONT
  if (v in fontMap || Object.values(fontMap).includes(v)) return v
  return LEGACY_FONT_ALIAS[v] ?? DEFAULT_FONT
}

export function getRandomFont(): string {
  const allFonts = [...fontCategories.display, ...fontCategories.sans, ...fontCategories.mono]
  return allFonts[Math.floor(Math.random() * allFonts.length)]
}

export function getRandomFontFromCategory(category: keyof typeof fontCategories): string {
  const fonts = fontCategories[category]
  return fonts[Math.floor(Math.random() * fonts.length)]
}
