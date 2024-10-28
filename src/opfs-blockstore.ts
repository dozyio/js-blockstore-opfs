// src/opfs-blockstore.ts
/**
 * @packageDocumentation
 *
 * OPFSBlockstore is Origin Private File System blockstore for use in browsers.
 */

import { type AwaitIterable } from 'interface-store'
import map from 'it-map'
import parallelBatch from 'it-parallel-batch'
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
  private readonly _putManyConcurrency: number
  private readonly _getManyConcurrency: number
  private readonly _deleteManyConcurrency: number
  private requestId = 0
  private readonly workerPendingRequests = new Map<number, { resolve(value: any): void, reject(reason?: any): void }>()

  constructor (path: string, opts?: OPFSBlockstoreInit) {
    this.path = path
    this._putManyConcurrency = opts?.putManyConcurrency ?? 50
    this._getManyConcurrency = opts?.getManyConcurrency ?? 50
    this._deleteManyConcurrency = opts?.deleteManyConcurrency ?? 50

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
    await this.callWorker('open', {
      path: this.path,
      getManyConcurrency: this._getManyConcurrency,
      putManyConcurrency: this._putManyConcurrency,
      deleteManyConcurrency: this._deleteManyConcurrency
    })
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
    yield * parallelBatch(
      map(source, ({ cid, block }) => {
        return async () => {
          await this.put(cid, block)

          return cid
        }
      }),
      this._putManyConcurrency
    )
  }

  /**
   * Gets a block by its CID.
   *
   * @throws NotFoundError
   */
  async get (key: CID): Promise<Uint8Array> {
    return this.callWorker('get', { key: key.toString() })
  }

  /**
   * Gets multiple blocks.
   *
   * @throws NotFoundError
   */
  async * getMany (source: AwaitIterable<CID>): AsyncIterable<Pair> {
    yield * parallelBatch(
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
   * Gets all blocks.
   */
  async * getAll (): AsyncIterable<Pair> {
    yield * this.mainThreadFS.getAll()
  }

  /**
   * Deletes a block by its CID.
   *
   * @throws DeleteFailedError
   */
  async delete (key: CID): Promise<void> {
    return this.callWorker('delete', { key: key.toString() })
  }

  /**
   * Deletes multiple blocks.
   *
   * @throws DeleteFailedError
   */
  async * deleteMany (source: AwaitIterable<CID>): AsyncIterable<CID> {
    yield * parallelBatch(
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
   * Deletes all blocks.
   */
  async deleteAll (): Promise<void> {
    return this.callWorker('deleteAll', { path: this.path })
  }

  /**
   * Checks if a block exists by its original CID.
   *
   * @returns A boolean indicating existence.
   */
  async has (key: CID): Promise<boolean> {
    return this.callWorker('has', { key: key.toString() })
  }

  public get deleteManyConcurrency (): number {
    return this._deleteManyConcurrency
  }

  public get getManyConcurrency (): number {
    return this._getManyConcurrency
  }
}
