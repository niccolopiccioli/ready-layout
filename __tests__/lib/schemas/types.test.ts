import type { TemplateSchema, Field } from '@/lib/schemas/types'

describe('TemplateSchema types', () => {
  it('accepts a valid schema shape', () => {
    const schema: TemplateSchema = {
      id: 'test',
      name: 'Test Template',
      sections: [
        {
          id: 'hero',
          label: 'Hero',
          blockType: 'hero',
          fields: [
            { id: 'headline', type: 'text', label: 'Headline', default: 'Hello', multiline: false },
            { id: 'bg', type: 'color', label: 'Background', default: '#000000' },
          ],
        },
      ],
    }
    expect(schema.id).toBe('test')
    expect(schema.sections[0].fields).toHaveLength(2)
  })

  it('accepts a repeater field with itemSchema', () => {
    const field: Field = {
      id: 'items',
      type: 'repeater',
      label: 'Items',
      default: [],
      itemSchema: [
        { id: 'title', type: 'text', label: 'Title', default: '' },
      ],
    }
    expect(field.type).toBe('repeater')
  })
})
