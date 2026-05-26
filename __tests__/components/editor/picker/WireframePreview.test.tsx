import { render } from '@testing-library/react'
import { WireframePreview } from '@/components/editor/picker/WireframePreview'
import type { BlockType } from '@/lib/schemas/types'

const ALL_BLOCK_TYPES: BlockType[] = [
  'hero', 'features', 'pricing', 'faq', 'cta', 'about', 'gallery', 'articles',
  'contact', 'linklist', 'menu', 'products', 'testimonials', 'stats', 'schedule', 'textblock',
]

describe('WireframePreview', () => {
  it('renders a wireframe for every known blockType without crashing', () => {
    for (const bt of ALL_BLOCK_TYPES) {
      const { container, unmount } = render(<WireframePreview blockType={bt} />)
      expect(container.querySelector('[data-wireframe]')).not.toBeNull()
      expect(container.querySelector(`[data-wireframe="${bt}"]`)).not.toBeNull()
      unmount()
    }
  })

  it('applies accentColor to the accent element', () => {
    const { container } = render(<WireframePreview blockType="hero" accentColor="rgb(255, 0, 0)" />)
    const accent = container.querySelector('[data-wireframe-accent]') as HTMLElement | null
    expect(accent).not.toBeNull()
    expect(accent!.style.background).toContain('255')
  })

  it('falls back to a generic wireframe for unknown blockType', () => {
    // @ts-expect-error — testing the runtime fallback
    const { container } = render(<WireframePreview blockType="unknown-block" />)
    expect(container.querySelector('[data-wireframe="fallback"]')).not.toBeNull()
  })
})
