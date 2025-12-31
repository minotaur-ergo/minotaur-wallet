---
'@minotaur-ergo/utils': minor
---

Create `ErgoNodeNetwork` class and write `getHeight`, `getAddressInfo`, `getAddressTransactions` using node API.
Add ErgoExplorerNetwork and ErgoNodeNetwork static instances to `mainnet.ts` and `testnet.ts`.
Then we create these instances in `init()` method on `initConfig` and in `MainnetNetworkSettings.tsx` and `TestnetNetworkSettings`.
