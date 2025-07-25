# minotaur-wallet

## 3.0.0

### Major Changes

- Update multi-sig communication data format

### Minor Changes

- Extract utils package
- Move types to new package
- AirDrop dapp added
- add `createChangeBox` to all dapps

### Patch Changes

- Fix scanning qrcode for multi-sig transaction
- Fix address validation and amount validation
- Ensure amount be lower or equal than maximum available sigUSD/sigRSV
- Fix address book element modification bug
- Implement error feedback for failed transaction generation
- Validate addresses before inserting a new wallet
- Fix a bug which cause all wallet disappeared when new wallet restored
- Validate the available amounts of Erg and tokens before transaction
- Fix delete wallet bug
- Ensure implementorFee min value ≥ wasm.BoxValue.SAFE_USER_MIN
- Updated dependencies
  - @minotaur-ergo/utils@1.1.0
  - @minotaur-ergo/icons@1.2.0
  - @minotaur-ergo/types@1.1.0

## 2.5.0

### Minor Changes

- Wallet pin
- Honey mode - Only display a list of specific wallets in this mode
- Allow to archive some wallets. These wallets are not displayed in wallet select page by default.
- Favorite wallets are displayed in start of wallets list.
- Toggle display archived wallet
- Change wallet password
- Select default address used for change box
- Select address from address book
- Add setting to configure whether open last active wallet or wallets list on next app load

### Patch Changes

- Updated dependencies
  - @minotaur-ergo/icons@1.1.0

## 2.4.0

### Minor Changes

- Display Token Detail on transaction signing page
- Allow multiple token burning on BurnToken dApp
- Update address asset details page to display token icon and id and name
- Display Token Detail in transaction generate page
- Update Transaction Box Display page to display token id and icon
- Display Transaction Details
- Display all values comma separated
- Animated qrcode display and scanning
- Add Transaction Display page

### Patch Changes

- Do not display token with amount equal to zero
- Fix Bug in Scanner
- Fix token select order
- Updated dependencies
  - @minotaur-ergo/icons@1.0.0

## 2.2.0

### Minor Changes

- Add Box Consolidation dApp

### Patch Changes

- Store Encrypted Mnemonic for each wallet.
- Explorer does not return the order of transactions correctly. We implemented a method to neutralize its effect.
- Fix Icon size
