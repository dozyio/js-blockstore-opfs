import { expect } from 'aegir/chai'
import { interfaceBlockstoreTests } from 'interface-blockstore-tests'
import { type OPFSBlockstore as Store } from '../src/index'

describe('interface-blockstore (opfs)', () => {
  it('opfs-mainthread', async () => {
    const { OPFSBlockstore, OPFSMainThreadFS } = await import('../src/index')

    try {
      interfaceBlockstoreTests({
        async setup () {
          const mainThreadFS = new OPFSMainThreadFS('bs')
          const store = new OPFSBlockstore(mainThreadFS)
          await store.open()
          return store
        },
        async teardown (store: Store) {
          await store.close()
        }
      })
      expect(true).to.be.true()
    } catch (err: any) {
      expect(err).to.not.exist()
    }
  })

  it('opfs-worker', async () => {
    const { OPFSBlockstore, OPFSWebWorkerFS } = await import('../src/index')
    try {
      interfaceBlockstoreTests({
        async setup () {
          const mainThreadFS = new OPFSWebWorkerFS('bs2')
          const store = new OPFSBlockstore(mainThreadFS)
          await store.open()
          return store
        },
        async teardown (store: Store) {
          await store.close()
        }
      })
      expect(true).to.be.true()
    } catch (err: any) {
      expect(err).to.not.exist()
    }
  })
})
