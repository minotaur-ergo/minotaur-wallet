# minotaur-wallet

## 3.4.0

### Minor Changes

- Add support for node
- Allow select Backend between node and explorer
- Hide chart if there was error in fetching Erg price during last year.
- Show balance chart for monthly or weekly period in wallet homepage.

### Patch Changes

- Fix check duplicate wallet for multi-sig wallets
- Fix description for delete wallet
- Updated dependencies
  - @minotaur-ergo/icons@1.5.0
  - @minotaur-ergo/utils@2.0.0
  - @minotaur-ergo/types@1.4.0

## 3.3.0

### Minor Changes

- Calculate tokens amount in selected currency
- Allow Paste whole mnemonic or a part of it in wallet restore.

### Patch Changes

- Fix warning in `MnemonicRestore.tsx` when type in input box.
- Fix bug in wallet creation in cold mode that displayed `error void(0) is not a function`
- Fix bug of auto select word after clicking anywhere on page.
- Updated dependencies
  - @minotaur-ergo/icons@1.4.0
  - @minotaur-ergo/utils@1.3.0
  - @minotaur-ergo/types@1.3.0

## 3.2.0

### Minor Changes

- Add BalanceDisplay component
- Add `Export` and `Import` wallet functionality
- Add `Paste` button instead of scan qrcode
- Add search input for currencies drawer
- Change api endpoint for fetching erg value based on currency
- Divide save & cancel buttons from currencies scrollable section
- Fetch unknown asset details when details are not stored yet
- Load & save other currencies and their symbols for balance display
- Move address related utility functions to `@minotaur-ergo/utils`

### Patch Changes

- Fix display of transaction with 0 erg transfer.
- Fix display derivation path in address card
- Fix remaining word counter in restore wallet page when no words entered
- Fix some typos
- Remove extra padding of qrcode in address qrcode display
- Updated dependencies
  - @minotaur-ergo/utils@1.2.0
  - @minotaur-ergo/types@1.2.0
  - @minotaur-ergo/icons@1.3.0

## 3.1.0

### Minor Changes

- Collapse assets of address
- Buy Erg button
- Convert to normal wallet when restore mnemonic of read-only wallet
- Update color style for home page card

### Patch Changes

- Fix problem fetching ERG price from coingecko
- Update ergo-lib-wasm to latest version
- Fixed an issue where the signature button was not displayed for ErgoPay transactions.
- Fix bug which cause passphrase removed when back button clicked in create or restore wallet
- Updated dependencies
  - @minotaur-ergo/types@1.1.1
  - @minotaur-ergo/utils@1.1.1

## 3.0.1

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
- Ensure amount is lower than or equal to maximum available sigUSD/sigRSV
- Fix address book element modification bug
- Implement error feedback for failed transaction generation
- Validate addresses before inserting a new wallet
- Fix a bug which caused all wallets to disappear when new wallet restored
- Validate the available amounts of Erg and tokens before transaction
- Fix delete wallet bug
- Ensure implementorFee min value ≥ wasm.BoxValue.SAFE_USER_MIN
- Updated dependencies
  - @minotaur-ergo/utils@1.1.0
  - @minotaur-ergo/icons@1.2.0
  - @minotaur-ergo/types@1.1.0

## 2.5.0

### Minor Changes

- Wallet PIN
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
