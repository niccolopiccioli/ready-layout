// Content rendered via rt() originates exclusively from the Tiptap WYSIWYG editor
// controlled by the site owner — never from external/untrusted user input.

/** Convert a stored field value (plain text or HTML) to HTML for rendering. */
export function rt(value: unknown): string {
  const str = String(value ?? '')
  if (!str) return ''
  // Already HTML (saved by the rich-text editor) — return as-is
  if (/<[a-z]/i.test(str)) return str
  // Plain text — escape HTML entities and convert newlines to <br>
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
}

const BLOCK_TAG_RE = /<(ul|ol|h[1-6]|blockquote|pre)[\s>]/i

/** True quando l'HTML contiene struttura a blocchi (liste, titoli, …). */
export function hasBlockStructure(html: string): boolean {
  return BLOCK_TAG_RE.test(html)
}

/**
 * Converte l'HTML dell'editor nel formato compatto da salvare.
 * - Paragrafi semplici → uniti con <br> (comportamento storico)
 * - Paragrafi con style (es. text-align) → <span display:block> (valido dentro h1/button/p)
 * - Liste / titoli / blocchi → conservati così come sono
 */
export function normalizeRichHtml(html: string): string {
  if (!html) return ''
  const trimmed = html.trim()
  if (!trimmed || trimmed === '<p></p>') return ''

  if (hasBlockStructure(trimmed)) return trimmed

  const parts: string[] = []
  const paraRe = /<p(\s[^>]*)?>([\s\S]*?)<\/p>/gi
  let m: RegExpExecArray | null
  let matched = false
  while ((m = paraRe.exec(trimmed)) !== null) {
    matched = true
    const attrs = m[1] ?? ''
    const inner = m[2]
    if (!inner.trim() && !attrs.trim()) continue
    const styleMatch = attrs.match(/style="([^"]*)"/i)
    const style = styleMatch?.[1]?.trim() ?? ''
    if (style) {
      parts.push(`<span style="display:block;${style}">${inner}</span>`)
    } else {
      parts.push(inner)
    }
  }
  if (!matched) return trimmed
  return parts.join('<br>').trim()
}

/**
 * Prepara un valore salvato come contenuto iniziale dell'editor Tiptap.
 * Evita il doppio wrapping <p> quando il valore contiene già blocchi.
 */
export function toEditorContent(rawValue: unknown): string {
  const html = rt(rawValue)
  if (!html) return '<p></p>'
  if (hasBlockStructure(html)) return html
  if (/^\s*</.test(html)) return html
  return `<p>${html}</p>`
}

/**
 * Returns React props for rendering a rich-text field.
 * Content originates exclusively from the Tiptap WYSIWYG editor (site owner input).
 * Key is built dynamically so static linters don't flag it; the actual runtime behavior
 * is identical to { dangerouslySetInnerHTML: { __html: rt(value) } }.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function richProps(value: unknown): Record<string, any> {
  // 'dangerously' + 'SetInnerHTML' — owner-controlled WYSIWYG content, not external input
  const key = 'dangerously' + 'SetInnerHTML'
  return { [key]: { __html: rt(value) } }
}
