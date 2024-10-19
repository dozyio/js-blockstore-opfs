import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'
import { OPFSBlockstore } from '../src/index'
import { OPFSMainThreadFS } from '../src/main-thread-fs'
import { OPFSWebWorkerFS } from '../src/web-worker-fs'

(window as any).OPFSMainThreadFS = OPFSMainThreadFS;
(window as any).OPFSWebWorkerFS = OPFSWebWorkerFS;
(window as any).OPFSBlockstore = OPFSBlockstore;
(window as any).CID = CID;
(window as any).sha256 = sha256
