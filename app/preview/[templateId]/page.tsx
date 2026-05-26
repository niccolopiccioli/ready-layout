import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTemplateById } from '@/lib/templates'
import { PreviewContent } from './PreviewContent'
import type { TemplateValues } from '@/lib/schemas/types'

interface PageProps {
  params: Promise<{ templateId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { templateId } = await params
  const schema = getTemplateById(templateId)
  if (!schema) return {}
  return {
    title: `${schema.name} — Anteprima ReadyLayout`,
    description: schema.description,
  }
}

function buildDefaults(schema: ReturnType<typeof getTemplateById>): TemplateValues {
  if (!schema) return {}
  return Object.fromEntries(
    schema.sections.map((section) => [
      section.id,
      Object.fromEntries(section.fields.map((field) => [field.id, field.default])),
    ])
  )
}

export default async function PreviewPage({ params }: PageProps) {
  const { templateId } = await params
  const schema = getTemplateById(templateId)
  if (!schema) notFound()

  const values = buildDefaults(schema)
  return <PreviewContent schema={schema} defaultValues={values} />
}
