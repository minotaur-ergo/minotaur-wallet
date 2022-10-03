# Minotaur wallet for ergo

---

<img src="https://user-images.githubusercontent.com/90670824/156564933-fe5a5189-4d26-4705-ac5a-93537dde2ba7.png" align="right"  width="300">

This is the first multi-platform wallet for ergo.

[![minotaur-wallet](https://snapcraft.io/minotaur-wallet/badge.svg)](https://snapcraft.io/minotaur-wallet)

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/minotaur-wallet)

Features:

- [x] generating wallets, restoring wallets in a way compatible to Yoroi and Ergo node and ergo android app
- [x] mnemonic passphrase
- [x] read only wallet support
- [x] [cold wallet devices](https://github.com/ergoplatform/ergo-wallet-app/wiki/Cold-wallet)
- [x] Displays and sends tokens and NFT
  - [x] Display Token Names according to [EIP-04](https://github.com/ergoplatform/eips/blob/master/eip-0004.md)
  - [x] Send Tokens in transactions.
  - [x] Issue new tokens in dApp part
- [x] Display Transaction in wallet.
- [x] Display generated transaction before signing
- [x] DApp support: Any dApp can embed directly in app. we currently create two dapp. one for issue token and one for sigma-usd.
- [x] Support Android and IOS mobile.
- [x] Support Desktop build for windows, max os X and linux
- [x] Wallet password to encrypt secret.
- [ ] Dynamic DApp setup: We're working to generate a dynamic protocol to add new dApp to wallet without an update.
- [ ] Minotaur dApp connector extension for chrome and firefox support
- [x] ErgoPay support
- [ ] MultiLingual wallet support
- [ ] Mem pool transaction support

[comment]: <> (You need at least Android 7 or iOS 13 to run Ergo Wallet.)

[comment]: <> (Visit the [Ergo Discord]&#40;https://discord.gg/kj7s7nb&#41; to give feedback.)

### Build wallet from source

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

two last commands are synced code for android and ios. if you want to build for desktop you must enter these two commands to sync code

```
npx cap sync electron
npx cap sync update electron
```

### Android

for android build you can use android studio and open `android` directory in project. then build it with android studio or any other tool you want.

### IOS

IOS users can open ios project in code, open it in xcode and build any version they want.

### Desktop systems

To build desktop version of project you must enter to electron directory and build project

```
npm run build
npm run electron:pack
npm run electron:make
```

### Tip the developer

If you want to tip the developer for making this app, thanks in advance! Send your tips to
[9hN2UY1ZvvWMeWRBso28vSyjrAAfGJHh2DkZpE47J7Wqr51YLAR](https://explorer.ergoplatform.com/payment-request?address=9hN2UY1ZvvWMeWRBso28vSyjrAAfGJHh2DkZpE47J7Wqr51YLAR&amount=0&description=)

### Testing on Testnet

You can test the testnet Android debug build on testnet or build the iOS version yourself for testnet. Generate a new wallet and send
yourself some test Ergos by visiting https://testnet.ergofaucet.org/
