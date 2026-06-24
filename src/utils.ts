import { AbortError } from 'abort-error'
import type { AbortOptions } from 'abort-error'

export type AwaitIterable<T> = Iterable<T> | AsyncIterable<T>

export type { AbortOptions }

export function throwIfAborted (options?: AbortOptions): void {
  if (options?.signal?.aborted === true) {
    throw new AbortError()
  }
}

export async function toUint8Array (value: Uint8Array | Iterable<Uint8Array> | AsyncIterable<Uint8Array>): Promise<Uint8Array> {
  if (value instanceof Uint8Array) {
    return value
  }

  const chunks: Uint8Array[] = []
  let byteLength = 0

  for await (const chunk of value) {
    chunks.push(chunk)
    byteLength += chunk.byteLength
  }

  const output = new Uint8Array(byteLength)
  let offset = 0

  for (const chunk of chunks) {
    output.set(chunk, offset)
    offset += chunk.byteLength
  }

  return output
}

export function toArrayBuffer (bytes: Uint8Array, forceCopy: boolean = false): ArrayBuffer {
  if (!forceCopy && bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength && bytes.buffer instanceof ArrayBuffer) {
    return bytes.buffer
  }

  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)

  return buffer
}

export async function * asByteStream (bytes: Uint8Array | Promise<Uint8Array>): AsyncGenerator<Uint8Array> {
  yield await bytes
}
