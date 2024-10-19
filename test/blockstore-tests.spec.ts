import { expect } from 'aegir/chai'
import { interfaceBlockstoreTests } from 'interface-blockstore-tests'
import { type OPFSBlockstore as Store } from '../src/index'

describe('interface-blockstore (opfs)', () => {
  (process.env.AEGIR_RUNNER === 'browser' ? it : it.skip)('opfs-mainthread', async () => {
    const { OPFSBlockstore, OPFSMainThreadFS } = await import('../src/index')

    try {
      interfaceBlockstoreTests({
        async setup () {
          const fs = new OPFSMainThreadFS('bs')
          const store = new OPFSBlockstore(fs)
          await store.open()
          return store
        },
        async teardown (store: Store) {
          await store.deleteAll()
          await store.close()
        }
      })
      expect(true).to.be.true()
    } catch (err: any) {
      expect(err).to.not.exist()
    }
  });

  (process.env.AEGIR_RUNNER === 'webworker' ? it : it.skip)('opfs-webworker', async () => {
    const { OPFSBlockstore, OPFSWebWorkerFS } = await import('../src/index')

    try {
      interfaceBlockstoreTests({
        async setup () {
          const fs = new OPFSWebWorkerFS('bs')
          const store = new OPFSBlockstore(fs)
          await store.open()
          return store
        },
        async teardown (store: Store) {
          await store.deleteAll()
          await store.close()
        }
      })
      expect(true).to.be.true()
    } catch (err: any) {
      expect(err).to.not.exist()
    }
  })
})
