import { startupLaunchpadSchema } from '@/lib/schemas/startup-launchpad'
import { StartupLaunchpad } from '@/components/templates/startup-launchpad'
import type { TemplateValues } from '@/lib/schemas/types'

function buildDefaults(): TemplateValues {
  return Object.fromEntries(
    startupLaunchpadSchema.sections.map((section) => [
      section.id,
      Object.fromEntries(section.fields.map((field) => [field.id, field.default])),
    ])
  )
}

export default function PreviewPage() {
  const values = buildDefaults()
  return (
    <div className="font-sans">
      <StartupLaunchpad values={values} />
    </div>
  )
}
