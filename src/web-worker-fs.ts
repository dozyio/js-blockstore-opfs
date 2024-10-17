// src/web-worker-fs.ts
import { type Pair } from 'interface-blockstore'
import { type AwaitIterable, DeleteFailedError, NotFoundError, OpenFailedError, PutFailedError } from 'interface-store'
import map from 'it-map'
import parallelBatch from 'it-parallel-batch'
import type { OPFSFileSystem, OPFSBlockstoreInit } from '.'
import type { CID } from 'multiformats/cid'

export class OPFSWebWorkerFS implements OPFSFileSystem {
  private readonly putManyConcurrency: number
  private readonly getManyConcurrency: number
  private readonly deleteManyConcurrency: number
  private readonly path: string
  private opfsRoot!: FileSystemDirectoryHandle
  private bsRoot!: FileSystemDirectoryHandle

  /**
   * @param path - The path to the OPFS directory, without slash
   * @param init - The OPFSBlockstoreInit object.
   */
  constructor (path: string, init: OPFSBlockstoreInit = {}) {
    this.deleteManyConcurrency = init.deleteManyConcurrency ?? 50
    this.getManyConcurrency = init.getManyConcurrency ?? 50
    this.putManyConcurrency = init.putManyConcurrency ?? 50
    this.path = path
  }

  async open (): Promise<void> {
    try {
      this.opfsRoot = await navigator.storage.getDirectory()
      this.bsRoot = await this.opfsRoot.getDirectoryHandle(this.path, { create: true })
    } catch (err) {
      throw new OpenFailedError(String(err))
    }
  }

  async close (): Promise<void> {
    // noop
  }

  /**
   * @throws PutFailedError
   * @throws QuotaExceededError
   */
  async put (key: CID, val: ArrayBuffer | ArrayBufferView): Promise<CID> {
    try {
      const fileHandle = await this.bsRoot.getFileHandle(key.toString(), { create: true })
      // @ts-expect-error: fileHandle.createSyncAccessHandle()
      const accessHandle = await fileHandle.createSyncAccessHandle()

      const n = accessHandle.write(val, { at: 0 })
      if (n !== val.byteLength) {
        throw new Error(`write length ${n} !== ${val.byteLength}`)
      }

      accessHandle.close()

      return key
    } catch (err) {
      throw new PutFailedError(String(err))
    }
  }

  async * putMany (source: AwaitIterable<Pair>): AsyncIterable<CID> {
    yield * parallelBatch(
      map(source, ({ cid, block }) => {
        return async () => {
          await this.put(cid, block)

          return cid
        }
      }),
      this.putManyConcurrency
    )
  }

  async get (key: CID): Promise<Uint8Array> {
    try {
      const fileHandle = await this.bsRoot.getFileHandle(key.toString(), { create: false })
      // @ts-expect-error: fileHandle.createSyncAccessHandle()
      const accessHandle = await fileHandle.createSyncAccessHandle()
      const size = accessHandle.getSize()

      const dataView = new DataView(new ArrayBuffer(size))
      accessHandle.read(dataView)

      return new Uint8Array(dataView.buffer)
    } catch (err) {
      throw new NotFoundError(String(err))
    }
  }

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
   * Deletes a block by its CID.
   *
   * @param key - CID.
   */
  async delete (key: CID): Promise<void> {
    try {
      await this.bsRoot.removeEntry(key.toString())
    } catch (err) {
      throw new DeleteFailedError(String(err))
    }
  }

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
   * Checks if a block exists by its original CID.
   *
   * @param key - The original CID.
   * @returns A boolean indicating existence.
   */
  async has (key: CID): Promise<boolean> {
    try {
      await this.bsRoot.getFileHandle(key.toString(), { create: false })
    } catch (e) {
      return false
    }

    return true
  }

  /**
   */
  // eslint-disable-next-line require-yield
  async * getAll (): AsyncIterable<Pair> {
    throw new Error('not supported')
  }
}
