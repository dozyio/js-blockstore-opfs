// src/index.ts
import { OPFSBlockstore } from './opfs-blockstore.ts'
import { workerScript } from './opfs-worker.ts'
import type { OPFSBlockstoreInit } from './opfs-blockstore.ts'

export { type OPFSBlockstoreInit, OPFSBlockstore, workerScript }
