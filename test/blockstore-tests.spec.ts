/* eslint-disable no-console */
import { expect } from 'aegir/chai'
import { interfaceBlockstoreTests } from 'interface-blockstore-tests'
import { OPFSMainThreadFS, OPFSWebWorkerFS, OPFSBlockstore } from '../src/index'

const pwOpts = (process.env.PW_OPTIONS != null) ? JSON.parse(process.env.PW_OPTIONS) : {}

// Test the blockstore wrapper
describe('interface-blockstore (OPFS Blockstore)', () => {
  it('OPFS blockstore', async () => {
    try {
      interfaceBlockstoreTests({
        async setup () {
          const store = new OPFSBlockstore('bs')
          await store.open()
          return store
        },
        async teardown (store: OPFSBlockstore) {
          await store.deleteAll()
          store.close()
        }
      })
      expect(true).to.be.true()
    } catch (err: any) {
      expect(err).to.not.exist()
    }
  })
})

// Test the underlying main thread implementation
describe('interface-blockstore (OPFS main thread implementation)', () => {
  // webkit doesn't support createWritable so skip this test
  (process.env.AEGIR_RUNNER === 'browser' && pwOpts.browser !== 'webkit' ? it : it.skip)('OPFS main thread', async () => {
    try {
      interfaceBlockstoreTests({
        async setup () {
          const store = new OPFSMainThreadFS('bs')
          await store.open()
          return store
        },
        async teardown (store: OPFSMainThreadFS) {
          await store.deleteAll()
          store.close()
        }
      })
      expect(true).to.be.true()
    } catch (err: any) {
      expect(err).to.not.exist()
    }
  })
})

// Test the underlying web worker implementation
describe('interface-blockstore (OPFS web worker implementation)', () => {
  (process.env.AEGIR_RUNNER === 'webworker' ? it : it.skip)('OPFS web worker', async () => {
    try {
      interfaceBlockstoreTests({
        async setup () {
          const store = new OPFSWebWorkerFS('bs')
          await store.open()
          return store
        },
        async teardown (store: OPFSWebWorkerFS) {
          await store.deleteAll()
          store.close()
        }
      })
      expect(true).to.be.true()
    } catch (err: any) {
      expect(err).to.not.exist()
    }
  })
})
