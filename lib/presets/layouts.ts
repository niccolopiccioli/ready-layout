import type { BlockType, Section } from '@/lib/schemas/types'

export interface LayoutPreset {
  id: string
  label: string
  category: 'hero' | 'features' | 'content' | 'commerce' | 'social' | 'utility'
  blockType: BlockType
  variant?: string
  build: (uniqueId: string) => Section
  defaultValues: Record<string, unknown>
}

export const LAYOUT_PRESETS: LayoutPreset[] = []

export function getPreset(id: string): LayoutPreset | undefined {
  return LAYOUT_PRESETS.find((p) => p.id === id)
}
