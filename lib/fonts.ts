// Font mapping for template randomization

export const fontMap: Record<string, string> = {
  'hanken': 'var(--font-hanken)',
  'playfair': 'var(--font-playfair)',
  'cormorant': 'var(--font-cormorant)',
  'lora': 'var(--font-lora)',
  'outfit': 'var(--font-outfit)',
  'plus-jakarta': 'var(--font-plus-jakarta)',
  'dm-sans': 'var(--font-dm-sans)',
  'manrope': 'var(--font-manrope)',
  'space-grotesk': 'var(--font-space-grotesk)',
  'syne': 'var(--font-syne)',
  'work-sans': 'var(--font-work-sans)',
  'sora': 'var(--font-sora)',
  'rubik': 'var(--font-rubik)',
  'inter': 'var(--font-inter)',
  'bebas-neue': 'var(--font-bebas-neue)',
  'oswald': 'var(--font-oswald)',
  'righteous': 'var(--font-righteous)',
  'jetbrains': 'var(--font-jetbrains)',
}

export const fontList = Object.keys(fontMap)

export const fontCategories = {
  serif: ['playfair', 'cormorant', 'lora'],
  sans: ['hanken', 'outfit', 'plus-jakarta', 'dm-sans', 'manrope', 'space-grotesk', 'syne', 'work-sans', 'sora', 'rubik', 'inter'],
  display: ['bebas-neue', 'oswald', 'righteous'],
  mono: ['jetbrains'],
}

export function getRandomFont(): string {
  const allFonts = [...fontCategories.sans, ...fontCategories.serif, ...fontCategories.display]
  return allFonts[Math.floor(Math.random() * allFonts.length)]
}

export function getRandomFontFromCategory(category: keyof typeof fontCategories): string {
  const fonts = fontCategories[category]
  return fonts[Math.floor(Math.random() * fonts.length)]
}