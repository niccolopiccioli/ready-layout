import type { Section, TemplateValues } from '@/lib/schemas/types'

export interface EditorPersistPayload {
  values: TemplateValues
  sectionOrder: string[]
  elementOrder: Record<string, Record<string, number[]>>
  sections: Section[]
}

export function storageKey(templateId: string): string {
  return `readylayout-${templateId}`
}

const SAVE_DEBOUNCE_MS = 300
const channelCache = new Map<string, BroadcastChannel>()

let pending: EditorPersistPayload | null = null
let pendingTemplateId: string | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function getSyncChannel(templateId: string): BroadcastChannel | null {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return null
  let channel = channelCache.get(templateId)
  if (!channel) {
    channel = new BroadcastChannel(`readylayout-sync-${templateId}`)
    channelCache.set(templateId, channel)
  }
  return channel
}

function writePayload(templateId: string, payload: EditorPersistPayload): void {
  try {
    localStorage.setItem(storageKey(templateId), JSON.stringify(payload))
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[readylayout] localStorage persist failed', err)
    }
  }
  try {
    getSyncChannel(templateId)?.postMessage(payload)
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[readylayout] BroadcastChannel post failed', err)
    }
  }
}

/** Debounced persist (field edits). Use `immediate` for undo/redo/reset. */
export function persistEditorState(
  templateId: string,
  payload: EditorPersistPayload,
  options?: { immediate?: boolean }
): void {
  pending = payload
  pendingTemplateId = templateId

  if (options?.immediate) {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
    flushEditorPersistence()
    return
  }

  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    flushEditorPersistence()
  }, SAVE_DEBOUNCE_MS)
}

/** Flush any pending debounced write (e.g. before navigation or in tests). */
export function flushEditorPersistence(): void {
  if (!pending || !pendingTemplateId) return
  const templateId = pendingTemplateId
  const payload = pending
  pending = null
  pendingTemplateId = null
  writePayload(templateId, payload)
}

export function loadPersistedState(templateId: string): EditorPersistPayload | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(storageKey(templateId))
    return saved ? (JSON.parse(saved) as EditorPersistPayload) : null
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[readylayout] loadPersistedState failed', err)
    }
    return null
  }
}

function parsePayload(raw: string): EditorPersistPayload | null {
  try {
    return JSON.parse(raw) as EditorPersistPayload
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[readylayout] invalid persisted payload', err)
    }
    return null
  }
}

/** Subscribe to cross-frame sync (BroadcastChannel + storage events). */
export function subscribeEditorSync(
  templateId: string,
  onUpdate: (payload: EditorPersistPayload) => void
): () => void {
  if (typeof window === 'undefined') return () => {}

  const key = storageKey(templateId)
  const channel = getSyncChannel(templateId)

  const apply = (payload: EditorPersistPayload | null) => {
    if (!payload) return
    onUpdate(payload)
  }

  const onStorage = (e: StorageEvent) => {
    if (e.key !== key || !e.newValue) return
    apply(parsePayload(e.newValue))
  }

  const onBroadcast = (e: MessageEvent) => {
    apply(e.data as EditorPersistPayload)
  }

  channel?.addEventListener('message', onBroadcast)
  window.addEventListener('storage', onStorage)

  return () => {
    channel?.removeEventListener('message', onBroadcast)
    window.removeEventListener('storage', onStorage)
  }
}
