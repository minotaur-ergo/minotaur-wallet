---
'minotaur-wallet': minor
---

Create useTokenPrice.ts hook to fetch all wallets' tokens values.
Use useTokenPrice() in AppRouter.
Add tokenBalances to BalanceDisplay props and calculate & use sum of tokens values.
Send wallets' tokens as prop in TotalBalanceCard.tsx, WalletCard.tsx, Wallets.tsx to BalanceDisplay.
