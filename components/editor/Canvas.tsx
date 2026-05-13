'use client'

import { useEditorStore } from '@/lib/store/editor-context'
import { StartupLaunchpad } from '@/components/templates/startup-launchpad'

export function Canvas() {
  const values = useEditorStore((s) => s.values)

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ background: 'var(--ed-bg)' }}
    >
      <div
        className="min-h-full mx-auto"
        style={{
          background: 'var(--ed-canvas)',
          boxShadow: '0 0 0 1px var(--ed-border-subtle)',
        }}
      >
        <StartupLaunchpad values={values} />
      </div>
    </div>
  )
}
