/**
 * Converts any CSS color string to a #rrggbb hex value.
 * Uses the 2D canvas context as a browser-native color parser
 * so it works with oklch(), hsl(), named colors, etc.
 */
export function cssColorToHex(color: string): string {
  if (!color) return '#000000'
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color
  if (/^#[0-9a-fA-F]{3}$/.test(color)) {
    return '#' + color.slice(1).split('').map((c) => c + c).join('')
  }
  if (typeof document === 'undefined') return '#000000'
  try {
    const cv = document.createElement('canvas')
    cv.width = cv.height = 1
    const ctx = cv.getContext('2d')
    if (!ctx) return '#000000'
    ctx.fillStyle = '#000000'
    ctx.fillStyle = color
    const s = ctx.fillStyle
    if (/^#[0-9a-fA-F]{6}$/.test(s)) return s
    const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
    if (m) {
      return (
        '#' +
        [m[1], m[2], m[3]]
          .map((n) => parseInt(n).toString(16).padStart(2, '0'))
          .join('')
      )
    }
    return '#000000'
  } catch {
    return '#000000'
  }
}
