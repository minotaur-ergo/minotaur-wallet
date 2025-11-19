---
'minotaur-wallet': minor
---

Create `useTokenPrice` hook to fetch all wallet's tokens values.
Use `useTokenPrice` in AppRouter.
Add `tokenBalances` to `BalanceDisplay` props and calculate & use sum of tokens values.
Send wallet's tokens as prop in `TotalBalanceCard`, `WalletCard`, `Wallets` to `BalanceDisplay`.
