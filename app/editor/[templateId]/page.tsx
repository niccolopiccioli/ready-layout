import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { EditorProvider } from '@/lib/store/editor-context'
import { EditorLayout } from '@/components/editor/EditorLayout'
import { getTemplateById } from '@/lib/templates'

interface PageProps {
  params: Promise<{ templateId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { templateId } = await params
  const schema = getTemplateById(templateId)
  if (!schema) return {}
  return {
    title: `${schema.name} — ReadyLayout`,
    description: schema.description,
  }
}

export default async function EditorPage({ params }: PageProps) {
  const { templateId } = await params
  const schema = getTemplateById(templateId)
  if (!schema) notFound()
  return (
    <EditorProvider schema={schema}>
      <EditorLayout />
    </EditorProvider>
  )
}
