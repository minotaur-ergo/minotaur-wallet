# Minotaur wallet for ergo

---

<img src="https://github.com/minotaur-ergo/minotaur-wallet/blob/dev/images/screen.png" align="right"  width="300" alt="screenShot" title="ScreenShot">

This is the first multi-platform wallet for ergo.

Features:

- [x] Generating wallets, restoring wallets in a way compatible to Yoroi and Ergo node and ergo android app
- [x] Support 12, 15, 18, 21 and 24 mnemonic size.
- [x] Mnemonic passphrase
- [x] Read only wallet support
- [x] [cold wallet devices](https://github.com/ergoplatform/ergo-wallet-app/wiki/Cold-wallet)
- [x] Displays and sends tokens and NFT
  - [x] Display Token Names according to [EIP-04](https://github.com/ergoplatform/eips/blob/master/eip-0004.md)
  - [x] Send Tokens in transactions.
  - [x] Issue new tokens in dApp part
  - [x] Burn tokens in dApp part
- [x] Display Transaction in wallet.
- [x] Display generated transaction before signing
- [x] DApp support: Any dApp can embed directly in app. we currently create three dapp. one for issue token, one for burning tokens and one for sigma-usd.
- [x] Support Android and IOS mobile.
- [x] Support Desktop build for windows, MacOS and linux
- [x] Wallet password to encrypt secret.
- [ ] Dynamic DApp setup: We're working to generate a dynamic protocol to add new dApp to wallet without an update.
- [ ] Minotaur dApp connector extension for chrome and firefox support
- [x] ErgoPay support
- [ ] MultiLingual wallet support
- [ ] Mempool transaction support

[comment]: <> (You need at least Android 7 or iOS 13 to run Ergo Wallet.)

[comment]: <> (Visit the [Ergo Discord]&#40;https://discord.gg/kj7s7nb&#41; to give feedback.)

### Build wallet from source

- ** You must install Node 20.11 to build minotaur **

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

### MacOs

For Apple Silicon chips (M series) you must use the `arm64` build. Using the intel-based build will result in camera malfunction.

In case of ***damaged file*** error, use this command:

```
sudo xattr -r -s com.apple.quarantine /Application/minotaur.app
```

### Tip the developer

If you want to tip the developer for making this app, thanks in advance! Send your tips to
[9hN2UY1ZvvWMeWRBso28vSyjrAAfGJHh2DkZpE47J7Wqr51YLAR](https://explorer.ergoplatform.com/payment-request?address=9hN2UY1ZvvWMeWRBso28vSyjrAAfGJHh2DkZpE47J7Wqr51YLAR&amount=0&description=)

### Testing on Testnet

Minotaur support both Mainnet and Testnet. Generate a new wallet and send
yourself some test Ergos by visiting https://testnet.ergofaucet.org/
