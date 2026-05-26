import { LAYOUT_PRESETS, getPreset } from '@/lib/presets/layouts'

describe('LAYOUT_PRESETS', () => {
  it('contiene almeno 8 preset', () => {
    expect(LAYOUT_PRESETS.length).toBeGreaterThanOrEqual(8)
  })

  it('ogni preset ha id univoco', () => {
    const ids = LAYOUT_PRESETS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('ogni preset.build produce una Section con i field richiesti', () => {
    for (const preset of LAYOUT_PRESETS) {
      const section = preset.build('test-id')
      expect(section.id).toBe('test-id')
      expect(section.blockType).toBe(preset.blockType)
      expect(Array.isArray(section.fields)).toBe(true)
      for (const key of Object.keys(preset.defaultValues)) {
        const field = section.fields.find((f) => f.id === key)
        expect(field).toBeDefined()
      }
    }
  })

  it('getPreset trova per id', () => {
    const first = LAYOUT_PRESETS[0]
    expect(getPreset(first.id)).toBe(first)
    expect(getPreset('nonexistent')).toBeUndefined()
  })

  it('copre i blockType principali', () => {
    const blockTypes = new Set(LAYOUT_PRESETS.map((p) => p.blockType))
    expect(blockTypes.has('hero')).toBe(true)
    expect(blockTypes.has('features')).toBe(true)
    expect(blockTypes.has('about')).toBe(true)
    expect(blockTypes.has('cta')).toBe(true)
  })
})
