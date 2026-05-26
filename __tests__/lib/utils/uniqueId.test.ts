import { uniqueSectionId } from '@/lib/utils/uniqueId'

describe('uniqueSectionId', () => {
  it('genera id con prefisso blockType e suffisso', () => {
    const id = uniqueSectionId('hero')
    expect(id).toMatch(/^hero-[a-z0-9]{6}$/)
  })

  it('produce id diversi su chiamate successive', () => {
    const a = uniqueSectionId('features')
    const b = uniqueSectionId('features')
    expect(a).not.toBe(b)
  })

  it('evita collisione con un set di id già usati', () => {
    const used = new Set(['hero-aaaaaa', 'hero-bbbbbb'])
    const id = uniqueSectionId('hero', used)
    expect(used.has(id)).toBe(false)
  })
})
