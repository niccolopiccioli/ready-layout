import { createEditorStore } from '@/lib/store/editor.store'
import { startupLaunchpadSchema } from '@/lib/schemas/startup-launchpad'

describe('store: sections mutabili', () => {
  it('inizializza sections come deep clone di schema.sections', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const state = store.getState()
    expect(state.sections).toHaveLength(startupLaunchpadSchema.sections.length)
    expect(state.sections[0].id).toBe(startupLaunchpadSchema.sections[0].id)
    expect(state.sections).not.toBe(startupLaunchpadSchema.sections)
  })

  it('sectionOrder iniziale matcha sections', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const { sectionOrder, sections } = store.getState()
    expect(sectionOrder).toEqual(sections.map((s) => s.id))
  })
})
