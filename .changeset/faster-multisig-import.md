---
'@minotaur-ergo/wallet': patch
---

Speed up importing large multi-sig transactions: check for an existing commitment in linear time, and skip loading input boxes and computing ERG and token totals in the multi-sig list when the wallet hides transaction details.
