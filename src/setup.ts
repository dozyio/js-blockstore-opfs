import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'
import { OPFSMainThreadFS } from './main-thread-fs'
import { OPFSWebWorkerFS } from './web-worker-fs'
import { OPFSBlockstore } from './index'

(window as any).OPFSMainThreadFS = OPFSMainThreadFS;
(window as any).OPFSWebWorkerFS = OPFSWebWorkerFS;
(window as any).OPFSBlockstore = OPFSBlockstore;
(window as any).CID = CID;
(window as any).sha256 = sha256
