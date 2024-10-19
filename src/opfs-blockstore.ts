// src/opfs-blockstore.ts
/**
 * @packageDocumentation
 *
 * OPFSBlockstore is Origin Private File System blockstore for use in browsers.
 */

import { type AwaitIterable } from 'interface-store'
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
  close(): Promise<void>
  deleteAll(): Promise<void>
}

export class OPFSBlockstore implements Blockstore {
  private readonly fs: OpenCloseDeleteAllBlockstore

  constructor (fs: OpenCloseDeleteAllBlockstore) {
    this.fs = fs
  }

  /**
   * @throws OpenFailedError
   */
  async open (): Promise<void> {
    await this.fs.open()
  }

  async close (): Promise<void> {
    await this.fs.close()
  }

  /**
   * @throws PutFailedError
   * @throws QuotaExceededError
   */
  async put (key: CID, val: Uint8Array): Promise<CID> {
    return this.fs.put(key, val)
  }

  /**
   * @throws PutFailedError
   * @throws QuotaExceededError
   */
  async * putMany (source: AwaitIterable<Pair>): AsyncIterable<CID> {
    yield * this.fs.putMany(source)
  }

  /**
   * @throws NotFoundError
   */
  async get (key: CID): Promise<Uint8Array> {
    return this.fs.get(key)
  }

  async * getMany (source: AwaitIterable<CID>): AsyncIterable<Pair> {
    yield * this.fs.getMany(source)
  }

  /**
   * Deletes a block by its CID.
   *
   * @param key - CID.
   * @throws DeleteFailedError
   */
  async delete (key: CID): Promise<void> {
    await this.fs.delete(key)
  }

  /**
   * @throws DeleteFailedError
   */
  async * deleteMany (source: AwaitIterable<CID>): AsyncIterable<CID> {
    yield * this.fs.deleteMany(source)
  }

  /**
   * Checks if a block exists by its original CID.
   *
   * @param key - The original CID.
   * @returns A boolean indicating existence.
   */
  async has (key: CID): Promise<boolean> {
    return this.fs.has(key)
  }

  /**
   */
  async * getAll (): AsyncIterable<Pair> {
    yield * this.fs.getAll()
  }

  async deleteAll (): Promise<void> {
    await this.fs.deleteAll()
  }

  async free (): Promise<StorageEstimate> {
    return navigator.storage.estimate()
  }
}
