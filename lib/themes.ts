// Preset color palettes for templates
export interface ThemePalette {
  name: string
  description: string
  bg: string
  text: string
  accent: string
  secondary: string
}

export const themes: ThemePalette[] = [
  {
    name: 'Midnight',
    description: 'Eleganza scura',
    bg: 'hsl(220, 25%, 8%)',
    text: 'hsl(220, 15%, 95%)',
    accent: 'hsl(265, 70%, 55%)',
    secondary: 'hsl(220, 20%, 60%)',
  },
  {
    name: 'Sunrise',
    description: 'Energia calda',
    bg: 'hsl(35, 90%, 97%)',
    text: 'hsl(35, 40%, 15%)',
    accent: 'hsl(25, 85%, 55%)',
    secondary: 'hsl(35, 30%, 50%)',
  },
  {
    name: 'Ocean',
    description: 'Calma professionale',
    bg: 'hsl(195, 30%, 96%)',
    text: 'hsl(195, 25%, 20%)',
    accent: 'hsl(195, 65%, 45%)',
    secondary: 'hsl(195, 20%, 55%)',
  },
  {
    name: 'Forest',
    description: 'Natura fresca',
    bg: 'hsl(150, 20%, 96%)',
    text: 'hsl(150, 20%, 15%)',
    accent: 'hsl(145, 55%, 40%)',
    secondary: 'hsl(150, 15%, 45%)',
  },
  {
    name: 'Rose',
    description: 'Sofisticato rosa',
    bg: 'hsl(330, 30%, 97%)',
    text: 'hsl(330, 20%, 20%)',
    accent: 'hsl(330, 60%, 50%)',
    secondary: 'hsl(330, 20%, 55%)',
  },
  {
    name: 'Monochrome',
    description: 'Classico minimal',
    bg: 'hsl(0, 0%, 98%)',
    text: 'hsl(0, 0%, 10%)',
    accent: 'hsl(0, 0%, 25%)',
    secondary: 'hsl(0, 0%, 50%)',
  },
]

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export const deviceSizes: Record<DeviceType, { width: string; label: string; icon: string }> = {
  mobile: { width: '375px', label: 'Mobile', icon: '📱' },
  tablet: { width: '768px', label: 'Tablet', icon: '📋' },
  desktop: { width: '100%', label: 'Desktop', icon: '💻' },
}