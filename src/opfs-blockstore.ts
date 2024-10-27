// src/opfs-blockstore.ts
/**
 * @packageDocumentation
 *
 * OPFSBlockstore is Origin Private File System blockstore for use in browsers.
 */

import { type AwaitIterable } from 'interface-store'
import { OPFSMainThreadFS } from './main-thread-fs'
import type { Blockstore, Pair } from 'interface-blockstore'
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

interface OpenCloseDeleteAllBlockstore extends Blockstore {
  open(): Promise<void>
  close(): void
  deleteAll(): Promise<void>
}

export class OPFSBlockstore implements Blockstore {
  private readonly path: string
  private readonly mainThreadFS: OpenCloseDeleteAllBlockstore
  private readonly worker!: Worker
  private requestId = 0
  private readonly workerPendingRequests = new Map<number, { resolve(value: any): void, reject(reason?: any): void }>()

  constructor (path: string, opts?: OPFSBlockstoreInit) {
    this.path = path

    this.mainThreadFS = new OPFSMainThreadFS(path, opts)

    this.worker = new Worker(new URL('/dist/workers/opfs.worker.js', import.meta.url), {
      type: 'module'
    })

    this.worker.onmessage = (event) => {
      const { id, result, error, errorName, errorMessage, errorStack } = event.data
      const request = this.workerPendingRequests.get(id)
      if (request === undefined) {
        throw new Error(`Unknown request ID: ${id}`)
      }

      this.workerPendingRequests.delete(id)

      if (error === undefined) {
        request.resolve(result)
      }

      request.reject({ name: errorName, message: errorMessage, stack: errorStack })
    }
  }

  private async callWorker (method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = this.requestId++
      this.workerPendingRequests.set(id, { resolve, reject })
      this.worker.postMessage({ id, method, params }, [params].filter((x) => x instanceof ArrayBuffer))
    })
  }

  /**
   * Opens the blockstore.
   *
   * @throws OpenFailedError
   */
  async open (): Promise<void> {
    await this.mainThreadFS.open()
    await this.callWorker('open', { path: this.path })
  }

  /**
   * Closes the blockstore.
   */
  close (): void {
    this.mainThreadFS.close()
    this.worker.terminate()
  }

  /**
   * Puts a block by its CID.
   *
   * @throws PutFailedError
   * @throws QuotaExceededError
   */
  async put (key: CID, val: Uint8Array): Promise<CID> {
    return this.callWorker('put', { key: key.toString(), value: val })
  }

  /**
   * Puts multiple blocks.
   *
   * @throws PutFailedError
   * @throws QuotaExceededError
   */
  async * putMany (source: AwaitIterable<Pair>): AsyncIterable<CID> {
    yield * this.mainThreadFS.putMany(source)
  }

  /**
   * Gets a block by its CID.
   *
   * @throws NotFoundError
   */
  async get (key: CID): Promise<Uint8Array> {
    return this.callWorker('get', { key: key.toString() })
    // return this.mainThreadFS.get(key)
  }

  /**
   * Gets multiple blocks.
   *
   * @throws NotFoundError
   */
  async * getMany (source: AwaitIterable<CID>): AsyncIterable<Pair> {
    yield * this.mainThreadFS.getMany(source)
  }

  /**
   * Deletes a block by its CID.
   *
   * @throws DeleteFailedError
   */
  async delete (key: CID): Promise<void> {
    return this.callWorker('delete', { key: key.toString() })
    // await this.fs.delete(key)
  }

  /**
   * Deletes multiple blocks.
   *
   * @throws DeleteFailedError
   */
  async * deleteMany (source: AwaitIterable<CID>): AsyncIterable<CID> {
    yield * this.mainThreadFS.deleteMany(source)
  }

  /**
   * Checks if a block exists by its original CID.
   *
   * @returns A boolean indicating existence.
   */
  async has (key: CID): Promise<boolean> {
    // return this.mainThreadFS.has(key)
    return this.callWorker('has', { key: key.toString() })
    // return this.fs.has(key)
  }

  /**
   * Gets all blocks.
   */
  async * getAll (): AsyncIterable<Pair> {
    yield * this.mainThreadFS.getAll()
  }

  /**
   * Deletes all blocks.
   */
  async deleteAll (): Promise<void> {
    return this.callWorker('deleteAll', { path: this.path })
    // await this.mainThreadFS.deleteAll()
  }
}
