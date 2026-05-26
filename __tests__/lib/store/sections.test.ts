import { createEditorStore } from '@/lib/store/editor.store'
import { startupLaunchpadSchema } from '@/lib/schemas/startup-launchpad'
import { LAYOUT_PRESETS, type LayoutPreset } from '@/lib/presets/layouts'

const FAKE_PRESET: LayoutPreset = {
  id: 'test-fake',
  label: 'Test fake',
  category: 'hero',
  blockType: 'hero',
  build: (id) => ({
    id,
    label: 'Fake Hero',
    blockType: 'hero',
    fields: [
      { id: 'headline', type: 'text', label: 'Headline', default: 'Default' },
    ],
  }),
  defaultValues: { headline: 'Preset value' },
}

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

describe('store: addSection', () => {
  beforeEach(() => {
    LAYOUT_PRESETS.length = 0
    LAYOUT_PRESETS.push(FAKE_PRESET)
  })

  it('aggiunge una sezione in coda quando insertAfterId è null', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const before = store.getState().sectionOrder.length
    store.getState().addSection('test-fake', null)
    const state = store.getState()
    expect(state.sectionOrder).toHaveLength(before + 1)
    const newId = state.sectionOrder[state.sectionOrder.length - 1]
    expect(state.sections.find((s) => s.id === newId)).toBeDefined()
    expect(state.values[newId]).toEqual({ headline: 'Preset value' })
  })

  it('inserisce subito dopo insertAfterId', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const firstId = store.getState().sectionOrder[0]
    store.getState().addSection('test-fake', firstId)
    const state = store.getState()
    expect(state.sectionOrder[1]).toMatch(/^hero-[a-z0-9]{6}$/)
  })

  it('imposta la nuova sezione come activeSection', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().addSection('test-fake', null)
    const state = store.getState()
    const newId = state.sectionOrder[state.sectionOrder.length - 1]
    expect(state.activeSection).toBe(newId)
  })

  it('abilita undo dopo addSection', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const before = store.getState().sectionOrder.length
    store.getState().addSection('test-fake', null)
    expect(store.getState().canUndo).toBe(true)
    store.getState().undo()
    expect(store.getState().sectionOrder).toHaveLength(before)
  })

  it('no-op se presetId non esiste', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const before = store.getState().sectionOrder.length
    store.getState().addSection('nonexistent', null)
    expect(store.getState().sectionOrder).toHaveLength(before)
  })

  it('insertAfterId === "" inserisce all\'inizio', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().addSection('test-fake', '')
    const state = store.getState()
    expect(state.sectionOrder[0]).toMatch(/^hero-[a-z0-9]{6}$/)
  })
})

describe('store: removeSection', () => {
  beforeEach(() => {
    LAYOUT_PRESETS.length = 0
    LAYOUT_PRESETS.push(FAKE_PRESET)
  })

  it('rimuove una sezione esistente', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().addSection('test-fake', null)
    const newId = store.getState().sectionOrder[store.getState().sectionOrder.length - 1]
    const before = store.getState().sectionOrder.length
    store.getState().removeSection(newId)
    const state = store.getState()
    expect(state.sectionOrder).toHaveLength(before - 1)
    expect(state.sections.find((s) => s.id === newId)).toBeUndefined()
    expect(state.values[newId]).toBeUndefined()
  })

  it('no-op se sectionId è il primo di sectionOrder', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const firstId = store.getState().sectionOrder[0]
    const before = store.getState().sectionOrder.length
    store.getState().removeSection(firstId)
    expect(store.getState().sectionOrder).toHaveLength(before)
  })

  it('sposta activeSection alla precedente se la rimossa era attiva', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().addSection('test-fake', null)
    const newId = store.getState().sectionOrder[store.getState().sectionOrder.length - 1]
    store.getState().setActiveSection(newId)
    store.getState().removeSection(newId)
    expect(store.getState().activeSection).not.toBe(newId)
    expect(store.getState().activeSection).toBeTruthy()
  })

  it('undo ripristina la sezione rimossa', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().addSection('test-fake', null)
    const newId = store.getState().sectionOrder[store.getState().sectionOrder.length - 1]
    store.getState().removeSection(newId)
    store.getState().undo()
    expect(store.getState().sectionOrder).toContain(newId)
  })

  it('rimuove anche elementOrder per la sezione', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    store.getState().addSection('test-fake', null)
    const newId = store.getState().sectionOrder[store.getState().sectionOrder.length - 1]
    store.setState((s) => ({ elementOrder: { ...s.elementOrder, [newId]: { items: [0, 1] } } }))
    store.getState().removeSection(newId)
    expect(store.getState().elementOrder[newId]).toBeUndefined()
  })
})

describe('store: duplicateSection', () => {
  it('duplica sezione esistente subito dopo l\'originale', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const firstId = store.getState().sectionOrder[0]
    const beforeLen = store.getState().sectionOrder.length
    store.getState().duplicateSection(firstId)
    const state = store.getState()
    expect(state.sectionOrder).toHaveLength(beforeLen + 1)
    expect(state.sectionOrder[1]).not.toBe(firstId)
    const dupId = state.sectionOrder[1]
    const dup = state.sections.find((s) => s.id === dupId)!
    const orig = state.sections.find((s) => s.id === firstId)!
    expect(dup.blockType).toBe(orig.blockType)
    expect(state.values[dupId]).toEqual(state.values[firstId])
    expect(state.values[dupId]).not.toBe(state.values[firstId])
  })

  it('no-op se sectionId non esiste', () => {
    const store = createEditorStore(startupLaunchpadSchema)
    const before = store.getState().sectionOrder.length
    store.getState().duplicateSection('nonexistent')
    expect(store.getState().sectionOrder).toHaveLength(before)
  })
})
