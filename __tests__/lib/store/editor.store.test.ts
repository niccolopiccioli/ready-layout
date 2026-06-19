import { createEditorStore } from '@/lib/store/editor.store'
import { startupLaunchpadSchema } from '@/lib/schemas/startup-launchpad'
import { flushEditorPersistence } from '@/lib/editor-sync'

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

  it('undo restores reordered repeater items', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const before = [...(store.getState().values.features.items as unknown[])]
    store.getState().reorderElements('features', 'items', 0, 2)
    expect(store.getState().values.features.items).not.toEqual(before)
    store.getState().undo()
    expect(store.getState().values.features.items).toEqual(before)
  })

  it('debounces persistence until flush', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const key = 'readylayout-startup-launchpad'
    localStorage.removeItem(key)
    store.getState().updateField('hero', 'headline', 'Debounced')
    expect(localStorage.getItem(key)).toBeNull()
    flushEditorPersistence()
    const saved = JSON.parse(localStorage.getItem(key)!)
    expect(saved.values.hero.headline).toBe('Debounced')
  })

  it('exportTemplate includes sectionOrder and elementOrder', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const exported = store.getState().exportTemplate()
    expect(exported.sectionOrder.length).toBeGreaterThan(0)
    expect(exported.sections).toEqual(store.getState().sections)
    expect(exported.values).toEqual(store.getState().values)
    expect(exported.elementOrder).toEqual(store.getState().elementOrder)
  })

  it('reset restores field defaults but keeps added sections', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const initialCount = store.getState().sections.length
    store.getState().updateField('hero', 'headline', 'Changed')
    store.getState().reset()
    expect(store.getState().sections).toHaveLength(initialCount)
    expect(store.getState().values.hero.headline).toBe('Il tuo prodotto\ncambia tutto.')
  })
})
