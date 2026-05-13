import { EditorProvider } from '@/lib/store/editor-context'
import { EditorLayout } from '@/components/editor/EditorLayout'

export default function EditorPage() {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  )
}
