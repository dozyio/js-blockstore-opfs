// src/index.ts
/**
 * @packageDocumentation
 *
 * OPFSBlockstore is Origin Private File System blockstore for use in browsers.
 * Webworkers are WIP
 *
 * @example
 */

import map from 'it-map'
import parallelBatch from 'it-parallel-batch'
import type { Blockstore, Pair } from 'interface-blockstore'
import type { AwaitIterable } from 'interface-store'
import type { CID } from 'multiformats/cid'

export interface OPFSBlockstoreInit {
  /**
   * How many blocks to put in parallel when `.putMany` is called.
   * default: 50
   */
  putManyConcurrency?: number

  /**
   * How many blocks to read in parallel when `.getMany` is called.
   * default: 50
   */
  getManyConcurrency?: number

  /**
   * How many blocks to delete in parallel when `.deleteMany` is called.
   * default: 50
   */
  deleteManyConcurrency?: number
}

export class OPFSBlockstore implements Blockstore {
  private readonly putManyConcurrency: number
  private readonly getManyConcurrency: number
  private readonly deleteManyConcurrency: number
  private opfsRoot!: FileSystemDirectoryHandle

  constructor(init: OPFSBlockstoreInit = {}) {
    this.deleteManyConcurrency = init.deleteManyConcurrency ?? 50
    this.getManyConcurrency = init.getManyConcurrency ?? 50
    this.putManyConcurrency = init.putManyConcurrency ?? 50
  }

  async open(): Promise<void> {
    this.opfsRoot = await navigator.storage.getDirectory()
    console.log('OPFS root', this.opfsRoot)
  }

  async close(): Promise<void> {
  }

  async put(key: CID, val: Uint8Array): Promise<CID> {
    const fileHandle = await this.opfsRoot.getFileHandle(key.toString(), { create: true })
    const accessHandle = await fileHandle.createSyncAccessHandle()

    const n = accessHandle.write(val, { at: 0 })
    if (n !== val.length) {
      throw new Error('write failed')
    }

    accessHandle.flush()
    accessHandle.close()

    return key
  }

  async * putMany(source: AwaitIterable<Pair>): AsyncIterable<CID> {
    yield* parallelBatch(
      map(source, ({ cid, block }) => {
        return async () => {
          await this.put(cid, block)

          return cid
        }
      }),
      this.putManyConcurrency
    )
  }

  async get(key: CID): Promise<Uint8Array> {
    const fileHandle = await this.opfsRoot.getFileHandle(key.toString(), { create: false })
    const accessHandle = await fileHandle.createSyncAccessHandle()
    const size = accessHandle.getSize()

    const dataView = new DataView(new ArrayBuffer(size))
    accessHandle.read(dataView)

    return new Uint8Array(dataView.buffer)
  }

  async * getMany(source: AwaitIterable<CID>): AsyncIterable<Pair> {
    yield* parallelBatch(
      map(source, key => {
        return async () => {
          return {
            cid: key,
            block: await this.get(key)
          }
        }
      }),
      this.getManyConcurrency
    )
  }

  /**
   * Deletes a block by its CID.
   *
   * @param key - CID.
   */
  async delete(key: CID): Promise<void> {
    await this.opfsRoot.removeEntry(key.toString())
  }

  async * deleteMany(source: AwaitIterable<CID>): AsyncIterable<CID> {
    yield* parallelBatch(
      map(source, key => {
        return async () => {
          await this.delete(key)

          return key
        }
      }),
      this.deleteManyConcurrency
    )
  }

  /**
   * Checks if a block exists by its original CID.
   *
   * @param key - The original CID.
   * @returns A boolean indicating existence.
   */
  async has(key: CID): Promise<boolean> {
    const fileHandle = await this.opfsRoot.getFileHandle(key.toString(), { create: false })
    return (fileHandle !== null)
  }

  /**
   */
  async * getAll(): AsyncIterable<Pair> {
    throw new Error('not supported')
  }

  async free(): Promise<StorageEstimate> {
    return navigator.storage.estimate()
  }
}
