---
'@minotaur-ergo/types': minor
'@minotaur-ergo/wallet': patch
---

Move the multi-sig signing password out of `MultiSigContextType` into a separate `MultiSigPasswordContextType`, so typing the password no longer re-renders the whole multi-sig transaction page.
