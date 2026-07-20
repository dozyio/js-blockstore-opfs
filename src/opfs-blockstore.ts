// src/opfs-blockstore.ts
/**
 * @packageDocumentation
 *
 * OPFSBlockstore is Origin Private File System blockstore for use in browsers,
 * that uses a web worker to do all the operations.
 */

import map from 'it-map'
import parallelBatch from 'it-parallel-batch'
import { CID } from 'multiformats/cid'
import { workerScript } from './opfs-worker.ts'
import { asByteStream, throwIfAborted, toArrayBuffer, toUint8Array } from './utils.ts'
import type { AbortOptions, AwaitIterable } from './utils.ts'
import type { Blockstore, InputPair, Pair } from 'interface-blockstore'

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
  private readonly path: string
  private readonly worker!: Worker
  private readonly _putManyConcurrency: number
  private readonly _getManyConcurrency: number
  private readonly _deleteManyConcurrency: number
  private requestId = 0
  private readonly workerPendingRequests = new Map<number, { resolve(value: any): void, reject(reason?: any): void }>()

  constructor (path: string, opts?: OPFSBlockstoreInit) {
    this.path = path
    this._putManyConcurrency = opts?.putManyConcurrency ?? 1
    this._getManyConcurrency = opts?.getManyConcurrency ?? 50
    this._deleteManyConcurrency = opts?.deleteManyConcurrency ?? 1

    try {
      const blob = new Blob([workerScript], { type: 'text/javascript' })
      const blobUrl = globalThis.URL.createObjectURL(blob)
      this.worker = new Worker(blobUrl)
    } catch (e: any) {
      throw new Error(`Failed to instantiate web worker ${e}`)
    }

    this.worker.onmessage = (event) => {
      // console.log(this.workerPendingRequests)
      const { id, result, error, errorName, errorMessage, errorStack } = event.data
      const request = this.workerPendingRequests.get(id)
      if (request === undefined) {
        throw new Error(`Unknown request ID: ${id}`)
      }

      this.workerPendingRequests.delete(id)

      if (error === undefined) {
        request.resolve(result)
        return
      }

      // eslint-disable-next-line no-console
      console.log('worker request rejected', id, result, errorName)
      request.reject({ name: errorName, message: errorMessage, stack: errorStack })
    }
  }

  private async callWorker (method: string, params: any, transfer: Transferable[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = this.requestId++
      this.workerPendingRequests.set(id, { resolve, reject })
      this.worker.postMessage({ id, method, params }, transfer)
    })
  }

  /**
   * Opens the blockstore.
   *
   * @throws {OpenFailedError}
   */
  async open (): Promise<void> {
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
    this.worker.terminate()
  }

  /**
   * Puts a block by its CID.
   *
   * @throws {PutFailedError}
   * @throws {QuotaExceededError}
   */
  async put (key: CID, val: Uint8Array | Iterable<Uint8Array> | AsyncIterable<Uint8Array>, options?: AbortOptions): Promise<CID> {
    throwIfAborted(options)

    const buffer = toArrayBuffer(await toUint8Array(val), val instanceof Uint8Array)
    await this.callWorker('put', { key: key.toString(), value: buffer }, [buffer])

    return key
  }

  /**
   * Puts multiple blocks.
   *
   * @throws {PutFailedError}
   * @throws {QuotaExceededError}
   */
  async * putMany (source: AwaitIterable<InputPair>, options?: AbortOptions): AsyncGenerator<CID> {
    throwIfAborted(options)

    yield * parallelBatch(
      map(source, ({ cid, bytes }) => {
        return async () => {
          await this.put(cid, bytes, options)

          return cid
        }
      }),
      this._putManyConcurrency
    )
  }

  /**
   * Gets a block by its CID.
   *
   * @throws {NotFoundError}
   */
  get (key: CID, options?: AbortOptions): AsyncGenerator<Uint8Array> {
    throwIfAborted(options)

    return asByteStream(this.callWorker('get', { key: key.toString() }).then((bytes) => new Uint8Array(bytes)))
  }

  /**
   * Gets multiple blocks.
   *
   * @throws {NotFoundError}
   */
  async * getMany (source: AwaitIterable<CID>, options?: AbortOptions): AsyncGenerator<Pair> {
    throwIfAborted(options)

    yield * parallelBatch(
      map(source, key => {
        return async () => {
          return {
            cid: key,
            bytes: this.get(key, options)
          }
        }
      }),
      this.getManyConcurrency
    )
  }

  /**
   * Gets all blocks.
   */
  async * getAll (options?: AbortOptions): AsyncGenerator<Pair> {
    throwIfAborted(options)

    const keys: string[] = await this.callWorker('ls', {})

    yield * parallelBatch(
      map(keys, key => {
        return async () => {
          const cid = CID.parse(key)
          return {
            cid,
            bytes: this.get(cid, options)
          }
        }
      }),
      this.getManyConcurrency
    )
  }

  /**
   * Deletes a block by its CID.
   *
   * @throws {DeleteFailedError}
   */
  async delete (key: CID, options?: AbortOptions): Promise<void> {
    throwIfAborted(options)

    return this.callWorker('delete', { key: key.toString() })
  }

  /**
   * Deletes multiple blocks.
   *
   * @throws {DeleteFailedError}
   */
  async * deleteMany (source: AwaitIterable<CID>, options?: AbortOptions): AsyncGenerator<CID> {
    throwIfAborted(options)

    yield * parallelBatch(
      map(source, key => {
        return async () => {
          await this.delete(key, options)

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
  async has (key: CID, options?: AbortOptions): Promise<boolean> {
    throwIfAborted(options)

    return this.callWorker('has', { key: key.toString() })
  }

  public get putManyConcurrency (): number {
    return this._putManyConcurrency
  }

  public get getManyConcurrency (): number {
    return this._getManyConcurrency
  }

  public get deleteManyConcurrency (): number {
    return this._deleteManyConcurrency
  }
}
