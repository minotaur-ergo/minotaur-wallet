---
'@minotaur-ergo/wallet': patch
---

Skip wallet sync while the device is offline, so an air-gapped signer no longer retries failed syncs in a loop.
