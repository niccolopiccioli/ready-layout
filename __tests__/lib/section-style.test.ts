import {
  SECTION_STYLE_DEFAULTS,
  getSectionStyle,
  isDefaultSectionStyle,
} from '@/lib/section-style'

describe('getSectionStyle', () => {
  it('ritorna i default con valori vuoti o mancanti', () => {
    expect(getSectionStyle(undefined)).toEqual(SECTION_STYLE_DEFAULTS)
    expect(getSectionStyle(null)).toEqual(SECTION_STYLE_DEFAULTS)
    expect(getSectionStyle({})).toEqual(SECTION_STYLE_DEFAULTS)
  })

  it('legge tutti i controlli e valida i range', () => {
    const style = getSectionStyle({
      _sAlign: 'right',
      _sWidth: 'md',
      _sTextAlign: 'center',
      _sPaddingY: 'lg',
      _sBorder: true,
      _sBorderColor: '#ff0000',
      _sBorderWidth: 4,
      _sBorderPos: 'top',
      _sRadius: 'full',
      _sShadow: true,
      _sHidden: true,
    })
    expect(style).toEqual({
      align: 'right',
      width: 'md',
      textAlign: 'center',
      paddingY: 'lg',
      borderEnabled: true,
      borderColor: '#ff0000',
      borderWidth: 4,
      borderPosition: 'top',
      borderRadius: 'full',
      shadow: true,
      hidden: true,
    })
  })

  it('scarta valori non validi e clampa lo spessore', () => {
    const style = getSectionStyle({
      _sAlign: 'diagonale',
      _sWidth: 'gigante',
      _sBorderWidth: 99,
      _sBorder: 'si',
    })
    expect(style.align).toBe(SECTION_STYLE_DEFAULTS.align)
    expect(style.width).toBe(SECTION_STYLE_DEFAULTS.width)
    expect(style.borderWidth).toBe(8)
    expect(style.borderEnabled).toBe(false)
  })

  it('isDefaultSectionStyle riconosce stile pulito vs modificato', () => {
    expect(isDefaultSectionStyle(SECTION_STYLE_DEFAULTS)).toBe(true)
    expect(isDefaultSectionStyle({ ...SECTION_STYLE_DEFAULTS, borderEnabled: true })).toBe(false)
    expect(isDefaultSectionStyle({ ...SECTION_STYLE_DEFAULTS, width: 'md' })).toBe(false)
    expect(isDefaultSectionStyle({ ...SECTION_STYLE_DEFAULTS, hidden: true })).toBe(false)
  })
})
