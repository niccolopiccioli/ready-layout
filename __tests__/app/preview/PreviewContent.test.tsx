import { render, screen, act } from '@testing-library/react'
import { PreviewContent } from '@/app/preview/[templateId]/PreviewContent'
import type { TemplateSchema } from '@/lib/schemas/types'

const TEMPLATE_ID = 'preview-test-tpl'

const mockSchema: TemplateSchema = {
  id: TEMPLATE_ID,
  name: 'Preview Test',
  sections: [
    {
      id: 'hero',
      label: 'Hero',
      blockType: 'hero',
      fields: [
        { id: 'headline',    type: 'text',  label: 'H',  default: 'Default headline' },
        { id: 'subheadline', type: 'text',  label: 'S',  default: 'Default sub' },
        { id: 'ctaLabel',    type: 'text',  label: 'C',  default: 'Default CTA' },
        { id: 'bgColor',     type: 'color', label: 'B',  default: '#000000' },
        { id: 'textColor',   type: 'color', label: 'T',  default: '#ffffff' },
        { id: 'accentColor', type: 'color', label: 'A',  default: '#ff0000' },
      ],
    },
  ],
}

const defaults = {
  hero: {
    headline: 'Default headline',
    subheadline: 'Default sub',
    ctaLabel: 'Default CTA',
    bgColor: '#000000',
    textColor: '#ffffff',
    accentColor: '#ff0000',
  },
}

const searchParamsMock = { get: jest.fn() }
jest.mock('next/navigation', () => ({
  useSearchParams: () => searchParamsMock,
}))

describe('PreviewContent', () => {
  beforeEach(() => {
    localStorage.clear()
    searchParamsMock.get.mockReset()
    searchParamsMock.get.mockReturnValue(null)
  })

  it('renders schema defaults when localStorage is empty', () => {
    render(<PreviewContent schema={mockSchema} defaultValues={defaults} />)
    expect(screen.getByText(/Default headline/i)).toBeInTheDocument()
  })

  it('hydrates from localStorage when payload exists', () => {
    const saved = {
      sections: [
        {
          id: 'hero',
          label: 'Hero',
          blockType: 'hero',
          fields: mockSchema.sections[0].fields,
        },
      ],
      sectionOrder: ['hero'],
      values: {
        hero: { ...defaults.hero, headline: 'Saved headline' },
      },
      elementOrder: {},
    }
    localStorage.setItem(`readylayout-${TEMPLATE_ID}`, JSON.stringify(saved))

    render(<PreviewContent schema={mockSchema} defaultValues={defaults} />)
    expect(screen.getByText(/Saved headline/i)).toBeInTheDocument()
  })

  it('ignores localStorage when clean=true', () => {
    const saved = {
      sections: mockSchema.sections,
      sectionOrder: ['hero'],
      values: { hero: { ...defaults.hero, headline: 'Saved headline' } },
      elementOrder: {},
    }
    localStorage.setItem(`readylayout-${TEMPLATE_ID}`, JSON.stringify(saved))
    searchParamsMock.get.mockImplementation((k: string) => (k === 'clean' ? 'true' : null))

    render(<PreviewContent schema={mockSchema} defaultValues={defaults} />)
    expect(screen.getByText(/Default headline/i)).toBeInTheDocument()
    expect(screen.queryByText(/Saved headline/i)).not.toBeInTheDocument()
  })

  it('falls back to defaults on malformed localStorage', () => {
    localStorage.setItem(`readylayout-${TEMPLATE_ID}`, '{not-json')
    render(<PreviewContent schema={mockSchema} defaultValues={defaults} />)
    expect(screen.getByText(/Default headline/i)).toBeInTheDocument()
  })

  it('reacts to storage events from other tabs', () => {
    render(<PreviewContent schema={mockSchema} defaultValues={defaults} />)
    expect(screen.getByText(/Default headline/i)).toBeInTheDocument()

    const updated = {
      sections: mockSchema.sections,
      sectionOrder: ['hero'],
      values: { hero: { ...defaults.hero, headline: 'Cross-tab headline' } },
      elementOrder: {},
    }
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: `readylayout-${TEMPLATE_ID}`,
        newValue: JSON.stringify(updated),
      }))
    })
    expect(screen.getByText(/Cross-tab headline/i)).toBeInTheDocument()
  })
})
