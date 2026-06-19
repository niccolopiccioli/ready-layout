import type { Field, Section } from '@/lib/schemas/types'

export interface ColorTheme {
  bg: string
  text: string
  accent: string
}

type UpdateField = (sectionId: string, fieldId: string, value: unknown) => void

function forEachField(sections: Section[], fn: (sectionId: string, field: Field) => void): void {
  for (const section of sections) {
    for (const field of section.fields) {
      fn(section.id, field)
    }
  }
}

/** Apply bg/text/accent theme to all color fields in the given sections. */
export function applyThemeToSections(
  sections: Section[],
  theme: ColorTheme,
  updateField: UpdateField
): void {
  forEachField(sections, (sectionId, field) => {
    if (field.type !== 'color') return
    const id = field.id.toLowerCase()
    if (id.includes('accent')) {
      updateField(sectionId, field.id, theme.accent)
    } else if (id.includes('bg') || id.includes('background')) {
      updateField(sectionId, field.id, theme.bg)
    } else if (id.includes('text') || id.includes('color')) {
      updateField(sectionId, field.id, theme.text)
    }
  })
}

export interface RandomizeOptions {
  palette: ColorTheme
  sampleHeadlines: string[]
  sampleSubheadlines: string[]
  pickHeadline: () => string
  pickSubheadline: () => string
  randomColor: () => string
}

/** Randomize colors and sample text across all sections (including user-added). */
export function randomizeSections(
  sections: Section[],
  options: RandomizeOptions,
  updateField: UpdateField
): void {
  const { palette, pickHeadline, pickSubheadline, randomColor } = options

  forEachField(sections, (sectionId, field) => {
    const id = field.id.toLowerCase()

    if (field.type === 'color') {
      if (id.includes('accent')) {
        updateField(sectionId, field.id, palette.accent)
      } else if (id.includes('bg') || id.includes('background')) {
        updateField(sectionId, field.id, palette.bg)
      } else if (id.includes('text') || id.includes('color')) {
        updateField(sectionId, field.id, palette.text)
      } else {
        updateField(sectionId, field.id, randomColor())
      }
      return
    }

    if (field.type === 'text') {
      if (id.includes('headline') || id.includes('title')) {
        updateField(sectionId, field.id, pickHeadline())
      } else if (id.includes('subheadline') || id.includes('subtext')) {
        updateField(sectionId, field.id, pickSubheadline())
      }
    }
  })
}
