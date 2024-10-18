/** @type {import('aegir').PartialOptions} */
export default {
  test: {
    files: [
      'test/**/blockstore-tests.spec.ts'
    ],
    target: ['browser', 'webworker']
  }
}
