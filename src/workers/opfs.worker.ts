// src/opfs-worker.ts
import { OPFSWebWorkerFS } from '../web-worker-fs'

let store: OPFSWebWorkerFS | undefined

// Event listener with a synchronous handler
self.addEventListener('message', (event) => {
  // Call the async handler and handle any uncaught errors
  handleMessage(event).catch((error: any) => {
    self.postMessage(
      {
        id: event.data.id,
        error,
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack
      }
    )
  })
})

async function handleMessage (event: MessageEvent): Promise<void> {
  const { id, method, params, getManyConcurrency, putManyConcurrency, deleteManyConcurrency } = event.data

  switch (method) {
    case 'open': {
      await handleOpen(id, params, getManyConcurrency, putManyConcurrency, deleteManyConcurrency)
      break
    }

    case 'close': {
      if (store === undefined) {
        // allow close to be called multiple times
        break
      }

      store.close()
      self.postMessage({ id, result: null })
      break
    }

    case 'put': {
      if (store === undefined) {
        throw new Error('store is not open')
      }

      const result = await store.put(params.key, params.value)
      self.postMessage({ id, result })
      break
    }

    case 'get': {
      if (store === undefined) {
        throw new Error('store is not open')
      }

      const result = await store.get(params.key)
      self.postMessage({ id, result }, { transfer: [result.buffer] })
      break
    }

    case 'delete': {
      if (store === undefined) {
        throw new Error('store is not open')
      }

      await store.delete(params.key)
      self.postMessage({ id, result: null })
      break
    }

    case 'deleteAll': {
      if (store === undefined) {
        throw new Error('store is not open')
      }

      await store.deleteAll()
      self.postMessage({ id, result: null })
      break
    }

    case 'has': {
      if (store === undefined) {
        throw new Error('store is not open')
      }

      const result = await store.has(params.key)
      self.postMessage({ id, result })
      break
    }

    case 'getMany':
      throw new Error('getMany not implemented')

    case 'putMany':
      throw new Error('putAll not implemented')

    case 'deleteMany':
      throw new Error('deleteMany not implemented')

    case 'getAll':
      throw new Error('getAll not implemented')

    default:
      throw new Error(`Unknown method: ${method}`)
  }
}

async function handleOpen (id: any, params: any, getManyConcurrency?: number, putManyConcurrency?: number, deleteManyConcurrency?: number): Promise<void> {
  const { path } = params
  store = new OPFSWebWorkerFS(path)
  await store.open()
  if (getManyConcurrency !== undefined) {
    store.setGetManyConcurrency(getManyConcurrency)
  }
  if (putManyConcurrency !== undefined) {
    store.setPutManyConcurrency(putManyConcurrency)
  }
  if (deleteManyConcurrency !== undefined) {
    store.setDeleteManyConcurrency(deleteManyConcurrency)
  }
  self.postMessage({ id, result: null })
}
