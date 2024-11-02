# OPFS Blockstore

Origin Private File System TS/JS blockstore implementation for
[IPFS](https://ipfs.io) / [Helia](https://github.com/ipfs/helia) - for use in
the browser.

## Install

```sh
npm install blockstore-opfs
```

or

```sh
yarn add blockstore-opfs
```

## Helia Usage

```js
import { unixfs } from '@helia/unixfs';
import { OPFSBlockstore } from 'blockstore-opfs';
import { createHelia } from 'helia';

(async () => {
  try {
    const store = new OPFSBlockstore('bs')
    await store.open();

    const helia = await createHelia({
      blockstore: store
    })

    const fs = unixfs(helia)

    const encoder = new TextEncoder()
    const cid = await fs.addBytes(encoder.encode('Hello World'))

    console.log('Added file:', cid.toString())


    const decoder = new TextDecoder()
    let text = ''

    for await (const chunk of fs.cat(cid)) {
      text += decoder.decode(chunk, {
        stream: true
      })
    }

    console.log('Added file contents:', text)

  } catch (err) {
    console.error(err);
  }
})();
```

## Standalone Usage

```js
import { OPFSBlockstore } from 'blockstore-opfs';
import { CID } from 'multiformats/cid';

(async () => {
  try {
    const store = new OPFSBlockstore('bs')
    await store.open();

    // Use the store as you would use any Blockstore
    const someCid = CID.parse('bafkreigh2akiscaildc6en5ynpwp45fucjk64o4uqa5fmsrzc4i4vqveae')
    const someData = new Uint8Array([1, 2, 3, 4, 5]);

    await store.put(someCid, someData);

    const data = await store.get(someCid);
    console.log('Retrieved data:', data);

    store.close()
  } catch (err) {
    console.error(err);
  }
})();
```

## Implementation Details

* Uses a web worker implementation for compatability with webkit browsers.
* See `src-worker` for the web worker wrapper - this is inlined during the build, see `src/opfs-worker.ts`
* Conforms to [interface-blockstore](https://github.com/ipfs/js-stores/tree/main/packages/interface-blockstore)


## View storage quota

```js
navigator.storage.estimate()
```

## Todo

- Benchmarks
- Sharding

## OPFS Links

- [Specification](https://fs.spec.whatwg.org/)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system)
- [The origin private file system](https://web.dev/articles/origin-private-file-system)
- [OFPS Explorer brower plugin](https://chromewebstore.google.com/detail/opfs-explorer/acndjpgkpaclldomagafnognkcgjignd?pli=1)

## License

MIT License
