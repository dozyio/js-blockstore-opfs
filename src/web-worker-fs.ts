/* eslint-disable no-console */
// src/web-worker-fs.ts
import { type Blockstore, type Pair } from 'interface-blockstore'
import { type AwaitIterable, DeleteFailedError, GetFailedError, NotFoundError, OpenFailedError, PutFailedError } from 'interface-store'
import map from 'it-map'
import parallelBatch from 'it-parallel-batch'
import { CID } from 'multiformats/cid'
import type { OPFSBlockstoreInit } from '.'

export class OPFSWebWorkerFS implements Blockstore {
  private putManyConcurrency: number
  private getManyConcurrency: number
  private deleteManyConcurrency: number
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

  close (): void {
    // noop
  }

  async putWithRetry (
    putFn: () => Promise<CID>,
    retries: number = 3,
    timeoutMs: number = 1000
  ): Promise<CID> {
    let attempt = 0
    const errors: Error[] = []

    while (attempt < retries) {
      attempt++
      try {
        const timeout = new Promise<CID>((_resolve, reject) =>
          setTimeout(() => { reject(new PutFailedError('Operation timed out')) }, timeoutMs)
        )

        const result = await Promise.race([putFn(), timeout])
        return result
      } catch (err) {
        errors.push(err as Error)
        console.warn(`Attempt ${attempt} failed: ${(err as Error).message}`)

        if (attempt >= retries) {
          const aggregatedMessage = errors
            .map((e, idx) => `Attempt ${idx + 1}: ${e.message}`)
            .join('; ')
          throw new PutFailedError(`All ${retries} attempts failed: ${aggregatedMessage}`)
        }

        await new Promise(resolve => setTimeout(resolve, 100)) // add small 100ms delay
      }
    }

    // This point should never be reached
    throw new PutFailedError('Unexpected error in putWithRetry')
  }

  async put (key: CID, val: ArrayBuffer): Promise<CID> {
    // Define the actual put operation as a function
    const putOperation = async (): Promise<CID> => {
      try {
        const fileHandle = await this.bsRoot.getFileHandle(key.toString(), { create: true })

        // @ts-expect-error: createSyncAccessHandle() is available in web workers
        const accessHandle = await fileHandle.createSyncAccessHandle()

        const bytesWritten = accessHandle.write(val, { at: 0 })
        if (bytesWritten !== val.byteLength) {
          accessHandle.close()
          throw new PutFailedError(`write length ${bytesWritten} !== ${val.byteLength}`)
        }

        accessHandle.close()

        return key
      } catch (err) {
        throw new PutFailedError(String(err))
      }
    }

    // Use the retry wrapper
    return this.putWithRetry(putOperation, 3, 1000)
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
      // @ts-expect-error: createSyncAccessHandle() is available in web workers
      const accessHandle = await fileHandle.createSyncAccessHandle()
      const size = accessHandle.getSize()

      const dataView = new DataView(new ArrayBuffer(size))
      accessHandle.read(dataView)

      accessHandle.close()

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

  async deleteWithRetry (
    deleteFn: () => Promise<void>,
    retries: number = 3,
    timeoutMs: number = 1000
  ): Promise<void> {
    let attempt = 0
    const errors: Error[] = []

    while (attempt < retries) {
      attempt++
      try {
        const timeout = new Promise<void>((_resolve, reject) =>
          setTimeout(() => { reject(new DeleteFailedError('Operation timed out')) }, timeoutMs)
        )

        await Promise.race([deleteFn(), timeout])
        return
      } catch (err) {
        errors.push(err as Error)
        console.warn(`Attempt ${attempt} failed: ${(err as Error).message}`)

        if (attempt >= retries) {
          const aggregatedMessage = errors
            .map((e, idx) => `Attempt ${idx + 1}: ${e.message}`)
            .join('; ')
          throw new DeleteFailedError(`All ${retries} attempts failed: ${aggregatedMessage}`)
        }

        await new Promise(resolve => setTimeout(resolve, 100)) // add small 100ms delay
      }
    }

    // This point should never be reached
    throw new DeleteFailedError('Unexpected error in deleteWithRetry')
  }

  /**
   * Deletes a block by its CID.
   *
   * @param key - CID.
   */
  async delete (key: CID): Promise<void> {
    const deleteOperation = async (): Promise<void> => {
      try {
        await this.bsRoot.removeEntry(key.toString())
      } catch (err) {
        throw new DeleteFailedError(String(err))
      }
    }

    return this.deleteWithRetry(deleteOperation, 3, 1000)
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

  async * getAll (): AsyncIterable<Pair> {
    try {
      // @ts-expect-error: this.bsRoot.entries() is a thing
      for await (const [name, handle] of this.bsRoot.entries()) {
        if (handle.kind === 'file') {
          let cid: CID
          try {
            cid = CID.parse(name)
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(`Skipping invalid CID filename: ${name}`)
            continue
          }

          try {
            const fileHandle = await this.bsRoot.getFileHandle(name, { create: false })
            // @ts-expect-error: fileHandle.createSyncAccessHandle()
            const accessHandle = await fileHandle.createSyncAccessHandle()
            const size = accessHandle.getSize()

            const dataView = new DataView(new ArrayBuffer(size))
            accessHandle.read(dataView)

            accessHandle.close()

            yield {
              cid, block: new Uint8Array(dataView.buffer)
            }
          } catch (err) {
            throw new GetFailedError(String(err))
          }
        }
      }
    } catch (err) {
      throw new GetFailedError(String(err))
    }
  }

  async deleteAll (): Promise<void> {
    if ('remove' in FileSystemFileHandle.prototype) {
      // @ts-expect-error: remove() is a thing in Chrome
      await this.bsRoot.remove({ recursive: true })
    } else {
      await this.opfsRoot.removeEntry(this.path, { recursive: true })
    }
  }

  async ls (): Promise<string[]> {
    const keys: string[] = []

    // @ts-expect-error: this.bsRoot.entries() is a thing
    for await (const [name] of this.bsRoot) {
      keys.push(name)
    }

    return keys
  }

  setPutManyConcurrency (concurrency: number): void {
    this.putManyConcurrency = concurrency
  }

  setGetManyConcurrency (concurrency: number): void {
    this.getManyConcurrency = concurrency
  }

  setDeleteManyConcurrency (concurrency: number): void {
    this.deleteManyConcurrency = concurrency
  }
}
