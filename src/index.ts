// src/index.ts
import { OPFSBlockstore } from './opfs-blockstore'
import { workerScript } from './opfs-worker'
import type { OPFSBlockstoreInit } from './opfs-blockstore'

export { type OPFSBlockstoreInit, OPFSBlockstore, workerScript }
