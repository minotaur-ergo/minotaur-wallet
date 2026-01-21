# @minotaur-ergo/utils

## 2.0.0

### Major Changes

- Remove constants

### Minor Changes

- Set `tokenValues` 0 when `getBoxTokensValue` gives NaN.
- Add `ErgoNodeNetwork`
- Add `BaseNetwork` to implement shared logic between explorer and node
- Add `BaseChain` to implement shared logic between mainnet and testnet
- Add `setUrl` function to switch backend and url for each chain
- Add `date.ts` which contains month names and two function for monthly and weekly labels.

### Patch Changes

- Updated dependencies
  - @minotaur-ergo/types@1.4.0

## 1.3.0

### Minor Changes

- Remove console import from `address.ts`.

### Patch Changes

- Updated dependencies
  - @minotaur-ergo/types@1.3.0

## 1.2.0

### Minor Changes

- Add currency.ts with symbol map & getCurrencySymbol function
- Add address related functions

### Patch Changes

- Fix getColor function for transaction with 0 erg transfer
- Updated dependencies
  - @minotaur-ergo/types@1.2.0

## 1.1.1

### Patch Changes

- Update ergo-lib-wasm to latest version
- Updated dependencies
  - @minotaur-ergo/types@1.1.1

## 1.1.0

### Minor Changes

- Extract utils package

### Patch Changes

- Updated dependencies
  - @minotaur-ergo/types@1.1.0
