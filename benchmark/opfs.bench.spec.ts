import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'
import { OPFSBlockstore } from '../src/index'

describe('OPFSBlockstore benchmark', () => {
  it('large writes and reads', async function () {
    this.timeout(120_000)

    const blockSize = 16 * 1024 * 1024
    const chunkSize = 256 * 1024
    const iterations = 3
    const store = new OPFSBlockstore(`bench-${Date.now()}`)
    const cids: CID[] = []

    await store.open()

    const timed = async (name: string, fn: () => Promise<void>): Promise<Record<string, number | string>> => {
      const start = performance.now()

      await fn()

      const durationMs = performance.now() - start

      return {
        name,
        durationMs: Math.round(durationMs),
        mibPerSecond: Math.round(((blockSize * iterations) / 1024 / 1024) / (durationMs / 1000))
      }
    }

    const makeCid = async (index: number): Promise<CID> => {
      return CID.createV1(0x55, await sha256.digest(new Uint8Array([index])))
    }

    const chunkedBytes = async function * (seed: number): AsyncGenerator<Uint8Array> {
      for (let offset = 0; offset < blockSize; offset += chunkSize) {
        yield new Uint8Array(Math.min(chunkSize, blockSize - offset)).fill(seed)
      }
    }

    const results = []

    try {
      results.push(await timed('put chunked bytes', async () => {
        for (let i = 0; i < iterations; i++) {
          const cid = await makeCid(i)
          cids.push(cid)
          await store.put(cid, chunkedBytes(i))
        }
      }))

      results.push(await timed('get and drain bytes', async () => {
        for (const cid of cids) {
          for await (const _chunk of store.get(cid)) {
            // drain stream
          }
        }
      }))
    } finally {
      await store.deleteAll()
    }

    console.table(results)
  })
})
