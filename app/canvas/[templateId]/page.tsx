import { notFound } from 'next/navigation'
import { getTemplateById } from '@/lib/templates'
import { CanvasContent } from './CanvasContent'

interface PageProps {
  params: Promise<{ templateId: string }>
}

export default async function CanvasPage({ params }: PageProps) {
  const { templateId } = await params
  const schema = getTemplateById(templateId)
  if (!schema) notFound()
  return <CanvasContent schema={schema} />
}
