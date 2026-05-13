'use client'

import { useEditorStore } from '@/lib/store/editor-context'
import { StartupLaunchpad } from '@/components/templates/startup-launchpad'

export function Canvas() {
  const values = useEditorStore((s) => s.values)

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100">
      <div className="min-h-full bg-white shadow-sm">
        <StartupLaunchpad values={values} />
      </div>
    </div>
  )
}
