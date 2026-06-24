## 1.0.0 (2026-06-24)

### Features

* configurable path to web worker, removed redundant tests ([b8658c3](https://github.com/dozyio/js-blockstore-opfs/commit/b8658c3f328d3365d5b02ec8567d6e957747289e))
* use web workers for the majority of calls apart from getAll. Add webkit support ([c7d10ee](https://github.com/dozyio/js-blockstore-opfs/commit/c7d10ee167a381e2dba1c4715edb3a4a53af82d2))
* wrap implementations - use web worker where possible but fallback to main thread for some ops ([6ebebbb](https://github.com/dozyio/js-blockstore-opfs/commit/6ebebbbe6df4bb026e1420702b2720384f707254))

### Bug Fixes

* add ls for webworker, getAll() now uses web worker ([33199c2](https://github.com/dozyio/js-blockstore-opfs/commit/33199c20cb5379fe6916174fcb2a0cc70e3c9f20))
* package.json ([9f64208](https://github.com/dozyio/js-blockstore-opfs/commit/9f64208bdb82421b2bae6a2545cfa48ae03a4fd9))
* ww missing open in tests ([8be4b7b](https://github.com/dozyio/js-blockstore-opfs/commit/8be4b7bcfd8dbcfb8f8ff66be7514d3affe3fb14))

### Trivial Changes

* bump deps ([#4](https://github.com/dozyio/js-blockstore-opfs/issues/4)) ([112db0c](https://github.com/dozyio/js-blockstore-opfs/commit/112db0cb8f5e1a21c985d023c09a527bc845aaf1))
* err message ([728fd82](https://github.com/dozyio/js-blockstore-opfs/commit/728fd8242e3d9e145cfbfa965ee14f72b7be2e96))
* fix tsconfig to output src js ([10b3091](https://github.com/dozyio/js-blockstore-opfs/commit/10b30918ee05cf0013fe802dd79a9ab4e4cfeffb))
* inline blob worker ([89dd6a1](https://github.com/dozyio/js-blockstore-opfs/commit/89dd6a1dc5405d62ff147db815fba7bb76f36f20))
* lint ([709ae6b](https://github.com/dozyio/js-blockstore-opfs/commit/709ae6b91b1923ca11779b380558a250a95c1198))
* move test files ([61cc97c](https://github.com/dozyio/js-blockstore-opfs/commit/61cc97ca5133be2b5c2b186d7bdb414c3c245273))
* remove `free`, add navigator.storage.estimate to docs, bump deps ([5dbe676](https://github.com/dozyio/js-blockstore-opfs/commit/5dbe6764403acaba277a2eb29061bbd0294764c5))
* remove debugging logs ([5baa23b](https://github.com/dozyio/js-blockstore-opfs/commit/5baa23b4936d8701cd731e5042346612dfe2a9e1))
* remove exports to implementations, update main ([606f801](https://github.com/dozyio/js-blockstore-opfs/commit/606f801720d6bd210e4c9bbd6f172bf96b614fa8))

### Documentation

* license, readme ([fd45edc](https://github.com/dozyio/js-blockstore-opfs/commit/fd45edc1bb2b9b907157b30e3cd4006cdbb5fea9))
* readme ([2e597da](https://github.com/dozyio/js-blockstore-opfs/commit/2e597da7c8f70b8e95a749b8347f357c1ef84576))
* readme ([bc2c6a6](https://github.com/dozyio/js-blockstore-opfs/commit/bc2c6a60a0e0c3d4e401b1f24d667f0d34f19f9a))
* readme ([cb62a97](https://github.com/dozyio/js-blockstore-opfs/commit/cb62a97d8e6c4ddada1d2c86a3c850791f598e69))
* readme ([b4748a8](https://github.com/dozyio/js-blockstore-opfs/commit/b4748a87d6fa585b54384974cbdab426a353f162))
* readme ([6bdd70e](https://github.com/dozyio/js-blockstore-opfs/commit/6bdd70eb781a82d9276b059b1468c93d2b4d408c))
