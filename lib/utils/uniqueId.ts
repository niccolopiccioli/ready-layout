import type { BlockType } from '@/lib/schemas/types'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'

function randomSuffix(length = 6): string {
  let s = ''
  const arr = new Uint32Array(length)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(arr)
    for (let i = 0; i < length; i++) s += ALPHABET[arr[i] % ALPHABET.length]
  } else {
    for (let i = 0; i < length; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return s
}

export function uniqueSectionId(blockType: BlockType, taken?: ReadonlySet<string>): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = `${blockType}-${randomSuffix(6)}`
    if (!taken || !taken.has(candidate)) return candidate
  }
  return `${blockType}-${randomSuffix(10)}`
}
