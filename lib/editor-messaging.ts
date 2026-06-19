/** Typed postMessage helpers for editor ↔ canvas iframe (same origin). */

export type ReadyLayoutMessage =
  | { type: 'readylayout-resize'; height: number }
  | { type: 'readylayout-section-active'; sectionId: string }
  | { type: 'readylayout-open-picker'; insertAfterId: string | null }

export function getEditorOrigin(): string {
  if (typeof window === 'undefined') return ''
  return window.location.origin
}

export function isReadyLayoutMessage(data: unknown): data is ReadyLayoutMessage {
  if (typeof data !== 'object' || data === null || !('type' in data)) return false
  const type = (data as { type: unknown }).type
  return typeof type === 'string' && type.startsWith('readylayout-')
}

/** Reject messages from other origins or unknown payloads. */
export function isTrustedEditorMessage(e: MessageEvent): e is MessageEvent<ReadyLayoutMessage> {
  if (typeof window === 'undefined') return false
  if (e.origin !== window.location.origin) return false
  return isReadyLayoutMessage(e.data)
}

export function postToParent(message: ReadyLayoutMessage): void {
  if (typeof window === 'undefined' || window.parent === window) return
  try {
    window.parent.postMessage(message, getEditorOrigin())
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[readylayout] postToParent failed', err)
    }
  }
}

export function postToWindow(message: ReadyLayoutMessage): void {
  if (typeof window === 'undefined') return
  window.postMessage(message, getEditorOrigin())
}
