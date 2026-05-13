import type { TemplateSchema } from '@/lib/schemas/types'
import { startupLaunchpadSchema } from '@/lib/schemas/startup-launchpad'
import { portfolioSchema } from '@/lib/schemas/portfolio'
import { bistroSchema } from '@/lib/schemas/bistro'
import { blogSchema } from '@/lib/schemas/blog'
import { shopSchema } from '@/lib/schemas/shop'
import { comingSoonSchema } from '@/lib/schemas/coming-soon'
import { linkInBioSchema } from '@/lib/schemas/link-in-bio'
import { eventSchema } from '@/lib/schemas/event'
import { agencySchema } from '@/lib/schemas/agency'
import { resumeSchema } from '@/lib/schemas/resume'

export const templates: TemplateSchema[] = [
  startupLaunchpadSchema,
  portfolioSchema,
  bistroSchema,
  blogSchema,
  shopSchema,
  comingSoonSchema,
  linkInBioSchema,
  eventSchema,
  agencySchema,
  resumeSchema,
]

export function getTemplateById(id: string): TemplateSchema | undefined {
  return templates.find((t) => t.id === id)
}
