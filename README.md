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

## Usage

```js
import { BlockstoreOPFS } from 'blockstore-opfs'

const blockstore = new BlockstoreOPFS('path/to/blockstore')

await blockstore.open()

await blockstore.put('hello', 'world')

console.log(await blockstore.get('hello'))

await blockstore.close()
```

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
