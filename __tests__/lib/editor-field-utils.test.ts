import { applyThemeToSections, randomizeSections } from '@/lib/editor-field-utils'
import type { Section } from '@/lib/schemas/types'

const sections: Section[] = [
  {
    id: 'hero',
    label: 'Hero',
    blockType: 'hero',
    fields: [
      { id: 'headline', type: 'text', label: 'H', default: 'Hi' },
      { id: 'bgColor', type: 'color', label: 'BG', default: '#000' },
      { id: 'textColor', type: 'color', label: 'T', default: '#fff' },
      { id: 'accentColor', type: 'color', label: 'A', default: '#f00' },
    ],
  },
]

describe('editor-field-utils', () => {
  it('applyThemeToSections updates color fields', () => {
    const updates: Array<[string, string, unknown]> = []
    applyThemeToSections(sections, { bg: '#111', text: '#eee', accent: '#abc' }, (s, f, v) => {
      updates.push([s, f, v])
    })
    expect(updates).toContainEqual(['hero', 'bgColor', '#111'])
    expect(updates).toContainEqual(['hero', 'textColor', '#eee'])
    expect(updates).toContainEqual(['hero', 'accentColor', '#abc'])
  })

  it('randomizeSections updates text headlines', () => {
    const updates: Array<[string, string, unknown]> = []
    randomizeSections(
      sections,
      {
        palette: { bg: '#1', text: '#2', accent: '#3' },
        sampleHeadlines: ['A'],
        sampleSubheadlines: ['B'],
        pickHeadline: () => 'Random title',
        pickSubheadline: () => 'Random sub',
        randomColor: () => '#999',
      },
      (s, f, v) => updates.push([s, f, v])
    )
    expect(updates).toContainEqual(['hero', 'headline', 'Random title'])
  })
})
