// opfs-worker.js
import { OPFSBlockstore, OPFSWebWorkerFS } from './dist/blockstore-opfs.js'
const fs = new OPFSWebWorkerFS('bs')
const store = new OPFSBlockstore(fs)

self.addEventListener('message', async (event) => {
  const { id, method, params } = event.data

  try {
    let result
    switch (method) {
      case 'open':
        await store.open()
        result = null
        break
      case 'close':
        await store.close()
        result = null
        break
      case 'put':
        await store.put(params.key, params.value)
        result = null
        break
      case 'get': {
        const data = await store.get(params.key)
        result = data.buffer
        break
      }
      case 'delete':
        await store.delete(params.key)
        result = null
        break
      case 'has': {
        const exists = await store.has(params.key)
        result = exists
        break
      }
      case 'getAll':
        throw new Error('getAll not implemented')
      default:
        throw new Error(`Unknown method: ${method}`)
    }

    self.postMessage({ id, result }, [result].filter((x) => x instanceof ArrayBuffer))
  } catch (error) {
    self.postMessage({ id, error: error.message })
  }
})
