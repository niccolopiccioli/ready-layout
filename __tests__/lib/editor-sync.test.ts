import { storageKey, persistEditorState, flushEditorPersistence, loadPersistedState } from '@/lib/editor-sync'
import { startupLaunchpadSchema } from '@/lib/schemas/startup-launchpad'
import { createEditorStore } from '@/lib/store/editor.store'

describe('editor-sync', () => {
  const templateId = startupLaunchpadSchema.id
  const key = storageKey(templateId)

  beforeEach(() => {
    localStorage.clear()
  })

  it('storageKey follows readylayout prefix', () => {
    expect(key).toBe(`readylayout-${templateId}`)
  })

  it('flush writes payload to localStorage', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const state = store.getState()
    store.getState().updateField('hero', 'headline', 'Synced')
    flushEditorPersistence()
    const loaded = loadPersistedState(templateId)
    expect(loaded?.values.hero.headline).toBe('Synced')
  })

  it('immediate persist skips debounce', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const payload = {
      values: store.getState().values,
      sectionOrder: store.getState().sectionOrder,
      elementOrder: store.getState().elementOrder,
      sections: store.getState().sections,
    }
    persistEditorState(templateId, payload, { immediate: true })
    expect(loadPersistedState(templateId)?.sectionOrder).toEqual(payload.sectionOrder)
  })
})
