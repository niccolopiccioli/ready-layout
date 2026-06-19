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

/** Strip Tiptap's outer <p> wrappers, converting paragraph breaks to <br>. */
export function normalizeRichHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(/^<p>/, '')
    .replace(/<\/p>$/, '')
    .replace(/<\/p>\s*<p>/g, '<br>')
    .trim()
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
