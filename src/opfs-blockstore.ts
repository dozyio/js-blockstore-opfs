// src/opfs-blockstore.ts
/**
 * @packageDocumentation
 *
 * OPFSBlockstore is Origin Private File System blockstore for use in browsers,
 * that uses a web worker to do all the operations.
 */

import { CID } from 'multiformats/cid'
import { OPFSMainThreadBlockstore } from './opfs-main-thread.ts'
import { OPFSWebWorkerBlockstore } from './opfs-web-worker.ts'
import { isClosable, isOpenable, supportsWorkers } from './utils.ts'
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

  /**
   * By default all OPFS operations will take place synchronously in a
   * WebWorker, pass `false` here to run operations asynchronously in the main
   * thread.
   *
   * In environments Where WebWorkers are not supported this defaults to
   * `false`, otherwise `true`.
   */
  useWebWorker?: boolean
}

export class OPFSBlockstore implements Blockstore {
  private readonly impl: Blockstore

  constructor (path: string, opts?: OPFSBlockstoreInit) {
    if (opts?.useWebWorker === false || !supportsWorkers()) {
      this.impl = new OPFSMainThreadBlockstore(path, opts)
    } else {
      this.impl = new OPFSWebWorkerBlockstore(path, opts)
    }
  }

  /**
   * Opens the blockstore.
   *
   * @throws {OpenFailedError}
   */
  async open (): Promise<void> {
    if (isOpenable(this.impl)) {
      await this.impl.open()
    }
  }

  /**
   * Closes the blockstore.
   */
  async close (): Promise<void> {
    if (isClosable(this.impl)) {
      await this.impl.close()
    }
  }

  /**
   * Puts a block by its CID.
   *
   * @throws {PutFailedError}
   * @throws {QuotaExceededError}
   */
  async put (key: CID, val: Uint8Array | Iterable<Uint8Array> | AsyncIterable<Uint8Array>, options?: AbortOptions): Promise<CID> {
    return this.impl.put(key, val, options)
  }

  /**
   * Puts multiple blocks.
   *
   * @throws {PutFailedError}
   * @throws {QuotaExceededError}
   */
  async * putMany (source: AwaitIterable<InputPair>, options?: AbortOptions): AsyncGenerator<CID> {
    yield * this.impl.putMany(source, options)
  }

  /**
   * Gets a block by its CID.
   *
   * @throws {NotFoundError}
   */
  async * get (key: CID, options?: AbortOptions): AsyncGenerator<Uint8Array> {
    yield * this.impl.get(key, options)
  }

  /**
   * Gets multiple blocks.
   *
   * @throws {NotFoundError}
   */
  async * getMany (source: AwaitIterable<CID>, options?: AbortOptions): AsyncGenerator<Pair> {
    yield * this.impl.getMany(source, options)
  }

  /**
   * Gets all blocks.
   */
  async * getAll (options?: AbortOptions): AsyncGenerator<Pair> {
    yield * this.impl.getAll(options)
  }

  /**
   * Deletes a block by its CID.
   *
   * @throws {DeleteFailedError}
   */
  async delete (key: CID, options?: AbortOptions): Promise<void> {
    await this.impl.delete(key, options)
  }

  /**
   * Deletes multiple blocks.
   *
   * @throws {DeleteFailedError}
   */
  async * deleteMany (source: AwaitIterable<CID>, options?: AbortOptions): AsyncGenerator<CID> {
    yield * this.impl.deleteMany(source, options)
  }

  /**
   * Checks if a block exists by its original CID.
   *
   * @returns A boolean indicating existence.
   */
  async has (key: CID, options?: AbortOptions): Promise<boolean> {
    return this.impl.has(key, options)
  }
}
