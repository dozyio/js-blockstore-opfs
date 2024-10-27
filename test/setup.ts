import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'
import { OPFSBlockstore } from '../src/index'

(window as any).OPFSBlockstore = OPFSBlockstore;
(window as any).CID = CID;
(window as any).sha256 = sha256
