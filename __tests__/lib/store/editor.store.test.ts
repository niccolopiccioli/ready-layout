import { createEditorStore } from '@/lib/store/editor.store'
import { startupLaunchpadSchema } from '@/lib/schemas/startup-launchpad'

describe('editor store', () => {
  it('initializes values from schema defaults', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const state = store.getState()
    expect(state.values['hero']['headline']).toBe('Il tuo prodotto\ncambia tutto.')
    expect(state.values['hero']['bgColor']).toBe('#0f172a')
  })

  it('updates a field value', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().updateField('hero', 'headline', 'New headline')
    expect(store.getState().values['hero']['headline']).toBe('New headline')
  })

  it('resets values to defaults', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().updateField('hero', 'headline', 'Changed')
    store.getState().reset()
    expect(store.getState().values['hero']['headline']).toBe('Il tuo prodotto\ncambia tutto.')
  })

  it('sets active section', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().setActiveSection('features')
    expect(store.getState().activeSection).toBe('features')
  })
})
