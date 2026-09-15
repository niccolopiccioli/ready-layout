import { rt, normalizeRichHtml, hasBlockStructure, toEditorContent } from '@/lib/richtext'

describe('rt', () => {
  it('escapa il testo semplice e converte newline', () => {
    expect(rt('a\nb')).toBe('a<br>b')
    expect(rt('5 > 3 & 2 < 4')).toBe('5 &gt; 3 &amp; 2 &lt; 4')
  })

  it('lascia passare HTML dell’editor', () => {
    expect(rt('ciao <strong>mondo</strong>')).toBe('ciao <strong>mondo</strong>')
  })
})

describe('hasBlockStructure', () => {
  it('rileva liste e titoli', () => {
    expect(hasBlockStructure('<ul><li>x</li></ul>')).toBe(true)
    expect(hasBlockStructure('<h2>Titolo</h2>')).toBe(true)
    expect(hasBlockStructure('ciao <strong>x</strong>')).toBe(false)
    expect(hasBlockStructure('testo semplice')).toBe(false)
  })
})

describe('normalizeRichHtml', () => {
  it('comportamento storico: paragrafi semplici uniti con <br>', () => {
    expect(normalizeRichHtml('<p>a</p><p>b</p>')).toBe('a<br>b')
    expect(normalizeRichHtml('<p>solo</p>')).toBe('solo')
    expect(normalizeRichHtml('<p></p>')).toBe('')
    expect(normalizeRichHtml('')).toBe('')
  })

  it('conserva liste e titoli così come sono', () => {
    const list = '<ul><li><p>uno</p></li><li><p>due</p></li></ul>'
    expect(normalizeRichHtml(list)).toBe(list)
    const h = '<h2>Titolo</h2>'
    expect(normalizeRichHtml(h)).toBe(h)
  })

  it('converte paragrafi allineati in span block (validi dentro h1/button/p)', () => {
    expect(normalizeRichHtml('<p style="text-align: center">X</p>')).toBe(
      '<span style="display:block;text-align: center">X</span>'
    )
  })

  it('mantiene formattazione inline e colori', () => {
    const html = '<p>ciao <strong style="color: rgb(255, 0, 0)">mondo</strong></p>'
    expect(normalizeRichHtml(html)).toBe('ciao <strong style="color: rgb(255, 0, 0)">mondo</strong>')
  })
})

describe('toEditorContent', () => {
  it('avvolge il testo semplice in <p>', () => {
    expect(toEditorContent('ciao')).toBe('<p>ciao</p>')
    expect(toEditorContent('')).toBe('<p></p>')
  })

  it('non crea doppio wrapping per blocchi', () => {
    const list = '<ul><li><p>x</p></li></ul>'
    expect(toEditorContent(list)).toBe(list)
  })
})
