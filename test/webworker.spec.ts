import { test, expect } from '@playwright/test'

test.describe('OPFSBlockstore WebWorker', () => {
  const pageWebWorker = 'http://localhost:3000/test-webworker.html'

  test.beforeEach(async ({ page }) => {
    // page.on('console', msg => { console.log(msg.text()) })

    await page.goto(pageWebWorker)
  })

  test('should put and get data', async ({ page }) => {
    const result = await page.evaluate(async () => {
      // Call methods exposed by the web worker
      const { CID } = (window as any)
      const { sha256 } = (window as any)
      const data = new TextEncoder().encode('Test Data')
      const hash = await sha256.digest(data)
      const cid = CID.createV1(0x55, hash)

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('open')

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('put', {
        key: cid.toString(),
        value: data.buffer
      })

      // Get data
      // @ts-expect-error // callWorkerMethod is a thing
      const dataBuffer = await window.callWorkerMethod('get', {
        key: cid.toString()
      })
      const retrievedData = new Uint8Array(dataBuffer)

      return {
        storedData: new TextDecoder().decode(retrievedData)
      }
    })

    expect(result.storedData).toBe('Test Data')
  })

  test('should check existence of a block', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { CID } = (window as any)
      const { sha256 } = (window as any)
      const data = new Uint8Array([4, 5, 6, 7])
      const hash = await sha256.digest(data)
      const cid = CID.createV1(0x55, hash)

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('open')

      // @ts-expect-error // callWorkerMethod is a thing
      const existsBefore = await window.callWorkerMethod('has', {
        key: cid.toString()
      })

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('put', {
        key: cid.toString(),
        value: data.buffer
      })

      // @ts-expect-error // callWorkerMethod is a thing
      const existsAfter = await window.callWorkerMethod('has', {
        key: cid.toString()
      })

      return { existsBefore, existsAfter }
    })

    expect(result.existsBefore).toBe(false)
    expect(result.existsAfter).toBe(true)
  })

  test('should delete a block', async ({ page }) => {
    const exists = await page.evaluate(async () => {
      const { CID } = (window as any)
      const { sha256 } = (window as any)
      const data = new Uint8Array([8, 9, 10, 11])
      const hash = await sha256.digest(data)
      const cid = CID.createV1(0x55, hash)

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('open')

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('put', {
        key: cid.toString(),
        value: data.buffer
      })

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('delete', {
        key: cid.toString()
      })

      // @ts-expect-error // callWorkerMethod is a thing
      return window.callWorkerMethod('has', {
        key: cid.toString()
      })
    })

    expect(exists).toBe(false)
  })

  test('should throw when getting a block that does not exist', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { CID } = (window as any)
      const { sha256 } = (window as any)
      const data = new Uint8Array([4, 5, 6, 7])
      const hash = await sha256.digest(data)
      const cid = CID.createV1(0x55, hash)

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('open')

      // Attempt to get the block, which should not exist
      try {
        // Get data
        // @ts-expect-error // callWorkerMethod is a thing
        await window.callWorkerMethod('get', {
          key: cid.toString()
        })
        // If no error is thrown, return null
        return null
      } catch (error: any) {
        // Return the error message
        return error.message
      }
    })

    expect(result).not.toBeNull()
    expect(result).toContain('NotFoundError')
  })

  test('should throw then deleting a block that does not exist', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { CID } = (window as any)
      const { sha256 } = (window as any)
      const data = new Uint8Array([8, 9, 10, 11])
      const hash = await sha256.digest(data)
      const cid = CID.createV1(0x55, hash)

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('open')

      try {
        // @ts-expect-error // callWorkerMethod is a thing
        await window.callWorkerMethod('delete', {
          key: cid.toString()
        })

        // If no error is thrown, return null
        return null
      } catch (error: any) {
        // Return the error message
        return error.message
      }
    })

    expect(result).not.toBeNull()
    expect(result).toContain('NotFoundError')
  })

  test('should return storage estimate with quota and usage', async ({ page }) => {
    const estimate = await page.evaluate(async () => {
      const { OPFSBlockstore } = (window as any)
      const { OPFSMainThreadFS } = (window as any)

      const mainThreadFS = new OPFSMainThreadFS('bs')
      const store = new OPFSBlockstore(mainThreadFS)
      await store.open()

      // Call the free() method
      return store.free()
    })

    // Verify that estimate is an object
    expect(typeof estimate).toBe('object')
    expect(estimate).not.toBeNull()

    // Verify that estimate has 'quota' and 'usage' properties
    expect(estimate).toHaveProperty('quota')
    expect(estimate).toHaveProperty('usage')

    // Verify that 'quota' and 'usage' are numbers
    expect(typeof estimate.quota).toBe('number')
    expect(typeof estimate.usage).toBe('number')
  })

  test.skip('should put and get multiple blocks using putMany and getMany', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { OPFSBlockstore } = (window as any)
      const { OPFSMainThreadFS } = (window as any)
      const { CID } = (window as any)
      const { sha256 } = (window as any)

      const mainThreadFS = new OPFSMainThreadFS('bs')
      const store = new OPFSBlockstore(mainThreadFS)
      await store.open()

      // Prepare multiple blocks
      const dataBlocks = [
        new Uint8Array([0, 1, 2, 3]),
        new Uint8Array([4, 5, 6, 7]),
        new Uint8Array([8, 9, 10, 11])
      ]

      // Create CIDs and Pairs
      const pairs = await Promise.all(
        dataBlocks.map(async (data) => {
          const hash = await sha256.digest(data)
          const cid = CID.createV1(0x55, hash) // 0x55 is the multicodec code for 'raw'
          return { cid, block: data }
        })
      )

      // Put many blocks
      const putResults = []
      for await (const cid of store.putMany(pairs)) {
        putResults.push(cid.toString())
      }

      // Get many blocks
      const cids = pairs.map((pair) => pair.cid)
      const getResults = []
      for await (const { cid, block } of store.getMany(cids)) {
        getResults.push({
          cid: cid.toString(),
          block: Array.from(block)
        })
      }

      return {
        putResults,
        getResults
      }
    })

    // Verify that all CIDs from putResults match expected CIDs
    expect(result.putResults.length).toBe(3)
    expect(result.putResults).toEqual(
      expect.arrayContaining([
        expect.any(String),
        expect.any(String),
        expect.any(String)
      ])
    )

    // Verify that getResults match the original data
    expect(result.getResults.length).toBe(3)
    const expectedDataBlocks = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11]
    ]
    for (let i = 0; i < 3; i++) {
      expect(result.getResults[i].block).toEqual(expectedDataBlocks[i])
    }
  })

  // test.skip('should delete multiple blocks using deleteMany', async ({ page }) => {
  //   // @TODO
  // })
  //
  // // skipped to stop thrashing storage
  // test.skip('should handle writing more data than the storage quota allows', async ({ page }) => {
  //   // @TODO
  // })
})
