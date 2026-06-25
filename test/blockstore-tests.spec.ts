import { expect } from 'aegir/chai'
import { interfaceBlockstoreTests } from 'interface-blockstore-tests'
import { OPFSBlockstore } from '../src/index.ts'
import { OPFSMainThreadBlockstore } from '../src/opfs-main-thread.ts'
import { OPFSWebWorkerBlockstore } from '../src/opfs-web-worker.ts'

// const pwOpts = (process.env.PW_OPTIONS != null) ? JSON.parse(process.env.PW_OPTIONS) : {}

// Test the blockstore using interface-blockstore-tests
describe('interface-blockstore (OPFS Blockstore)', () => {
  it('OPFS blockstore', async () => {
    try {
      interfaceBlockstoreTests({
        async setup () {
          const store = new OPFSBlockstore('bs-' + Date.now())
          await store.open()
          return store
        },
        async teardown (store: OPFSBlockstore) {
          await store.close()
        }
      })
      expect(true).to.be.true()
    } catch (err: any) {
      expect(err).to.not.exist()
    }
  })
})

describe('interface-blockstore (Main Thread OPFS Blockstore)', () => {
  it('OPFS blockstore', async () => {
    try {
      interfaceBlockstoreTests({
        async setup () {
          const store = new OPFSMainThreadBlockstore('bs-' + Date.now())
          await store.open()
          return store
        },
        async teardown (store: OPFSMainThreadBlockstore) {
          await store.close()
        }
      })
      expect(true).to.be.true()
    } catch (err: any) {
      expect(err).to.not.exist()
    }
  })
})

describe('interface-blockstore (WebWorker backed OPFS Blockstore)', () => {
  it('OPFS blockstore', async () => {
    try {
      interfaceBlockstoreTests({
        async setup () {
          const store = new OPFSWebWorkerBlockstore('bs-' + Date.now())
          await store.open()
          return store
        },
        async teardown (store: OPFSWebWorkerBlockstore) {
          await store.close()
        }
      })
      expect(true).to.be.true()
    } catch (err: any) {
      expect(err).to.not.exist()
    }
  })
})

// Test the underlying main thread implementation
// Main thread has been deprecated so skip these tests
// webkit doesn't support createWritable so skip this test on that browser
// (process.env.AEGIR_RUNNER === 'browser' && pwOpts.browser !== 'webkit' ? describe : describe.skip)('interface-blockstore (OPFS Main Thread FS)', () => {
//   it('OPFS main thread', async () => {
//     try {
//       interfaceBlockstoreTests({
//         async setup () {
//           const store = new OPFSMainThreadFS('bs')
//           await store.open()
//           return store
//         },
//         async teardown (store: OPFSMainThreadFS) {
//           await store.deleteAll()
//           store.close()
//         }
//       })
//       expect(true).to.be.true()
//     } catch (err: any) {
//       expect(err).to.not.exist()
//     }
//   })
// });

// // Test the underlying web worker implementation
// // As the main thread implementation is deprecated, we can also skip the web worker tests as they are covered by OPFSBlockstore
// (process.env.AEGIR_RUNNER === 'webworker' ? describe : describe.skip)('interface-blockstore (OPFS Web Worker FS)', () => {
//   it('OPFS web worker', async () => {
//     try {
//       interfaceBlockstoreTests({
//         async setup () {
//           const store = new OPFSWebWorkerFS('bs')
//           await store.open()
//           return store
//         },
//         async teardown (store: OPFSWebWorkerFS) {
//           await store.deleteAll()
//           store.close()
//         }
//       })
//       expect(true).to.be.true()
//     } catch (err: any) {
//       expect(err).to.not.exist()
//     }
//   })
// })
