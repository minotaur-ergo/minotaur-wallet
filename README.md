# Minotaur Wallet for Ergo

<img src="https://github.com/minotaur-ergo/minotaur-wallet/blob/dev/images/screen.png" align="right"  width="300" alt="screenShot" title="ScreenShot">

This is the first multi-platform wallet for Ergo.

Features:

- [x] Generate and restore wallets in a way compatible with Yoroi, Ergo node, and the Ergo Android app.
- [x] Support 12, 15, 18, 21 and 24 mnemonic size.
- [x] Support mnemonic passphrases.
- [x] Support read only wallets.
- [x] Support [cold wallet devices](https://github.com/ergoplatform/ergo-wallet-app/wiki/Cold-wallet).
- [x] Display and send tokens and NFTs.
  - [x] Display token names according to [EIP-04](https://github.com/ergoplatform/eips/blob/master/eip-0004.md).
  - [x] Send tokens in transactions.
  - [x] Issue new tokens via dApp.
  - [x] Burn tokens via dApp.
- [x] Display transactions in the wallet.
- [x] Display generated transactions before signing.
- [x] Support dApps: Any dApp can be embedded directly in the app. Currently supported dApps are:
  - [x] Issue token
  - [x] Burn token
  - [x] Box consolidation
  - [x] SigmaUSD
- [x] Support Android and iOS mobile platforms.
- [x] Support Desktop builds for Windows, macOS, and Linux.
- [x] Support wallet passwords to encrypt secrets.
- [ ] Support dynamic dApp setup: We're working to generate a dynamic protocol to add new dApps to the wallet without an update.
- [ ] Support Minotaur dApp connector extension for Chrome and Firefox.
- [x] Support ErgoPay.
- [ ] Support multilingual wallets.
- [ ] Support mempool transactions.
- [x] Support wallet PINs.
- [x] Support Honey Mode: Only display specific lists of wallets.
- [x] Support animated QR codes.

[comment]: <> (You need at least Android 7 or iOS 13 to run Ergo Wallet.)

[comment]: <> (Visit the [Ergo Discord]&#40;https://discord.gg/kj7s7nb&#41; to give feedback.)

### Build wallet from source

- **You must install Node 20.11 to build Minotaur**

- First you must clone repo using this command:

```
git clone git@github.com:minotaur-ergo/minotaur-wallet.git
```

- Then in cloned directory install dependency using commands below

```
cd minotaur-wallet

npm i
```

- Then you must build project using command below:

```
npm run build;
npx cap sync
npx cap update
```

The last two commands sync the code for Android and iOS. If you want to build for desktop, you must enter these two commands to sync code:

```
npx cap sync electron
npx cap sync update electron
```

### Android

For Android builds, you can use Android Studio and open the `android` directory in the project. Then build it with Android Studio or any other tool you want.

### iOS

iOS users can open the iOS project in Xcode and build any version they want.

### Desktop systems

To build desktop version of project you must enter to the electron directory and build project

```
npm run build
npm run electron:pack
npm run electron:make
```

### macOS

For Apple Silicon chips (M series) you must use the `arm64` build. Using the intel-based build will result in camera malfunction.

In case of **_damaged file_** error, use this command:

```
sudo xattr -r -d com.apple.quarantine /Applications/minotaur.app
```

### Tip the developer

If you want to tip the developer for making this app, thanks in advance! Send your tips to [9hN2UY1ZvvWMeWRBso28vSyjrAAfGJHh2DkZpE47J7Wqr51YLAR](https://explorer.ergoplatform.com/payment-request?address=9hN2UY1ZvvWMeWRBso28vSyjrAAfGJHh2DkZpE47J7Wqr51YLAR&amount=0&description=)

### Testing on Testnet

Minotaur supports both Mainnet and Testnet. Generate a new wallet and send yourself some test Ergos by visiting https://testnet.ergofaucet.org/
