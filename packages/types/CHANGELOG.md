# @minotaur-ergo/types

## 1.8.0

### Minor Changes

- Add camera switching to the desktop and web QR code scanner and fix its camera error handling.
- Add a "Transaction details" wallet setting, on by default. Turning it off hides the total ERG and tokens when opening a transaction to sign.
- Move the multi-sig signing password out of `MultiSigContextType` into a separate `MultiSigPasswordContextType`, so typing the password no longer re-renders the whole multi-sig transaction page.

## 1.7.0

### Minor Changes

- Add wallet networkType to DAppPropsType.

## 1.6.0

### Minor Changes

- StoreArchive type and config type

## 1.5.0

### Minor Changes

- add TxStatus enum.
- Add HideValues config types.

## 1.4.0

### Minor Changes

- Add `showBalanceChart` to `WalletStateType`.
- Add constants
- Add default explorer and node url for mainnet and testnet
- Add `setURL` method to `ChainTypeInterface`
- Add `balanceHistory` which contains each wallet's balance during last year.

## 1.3.0

### Minor Changes

- Add `TokenValues` interface.
- Add `tokenValues` to `WalletStateType` interface.

## 1.2.0

### Minor Changes

- Add paste functionality for qrcode context type
- Add `ExportWallet` type
- Add SymbolType

## 1.1.1

### Patch Changes

- Add DescriptionType for ErgoPay
- Update ergo-lib-wasm to latest version

## 1.1.0

### Minor Changes

- Add types package

### Patch Changes

- Implement new type as 'DerivedWalletAddress'
