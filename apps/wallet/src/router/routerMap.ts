export const WalletPageSuffix = {
  WalletHome: 'home',
  WalletTransaction: 'transaction',
  WalletTransactionDetail: 'transaction/:txId',
  WalletAsset: 'asset',
  WalletAddress: 'address',
  WalletDApps: 'dApps',
  WalletDAppView: 'dApp/:dAppId',
  WalletSettings: 'settings',
  WalletXPub: 'x-pub',
  WalletChangePassword: 'password-change',
  WalletMultiSig: 'multi-sig-communication/',
  WalletMultiSigTxView: 'multi-sig-communication/:txId',
  WalletSend: 'send',
  WalletBuy: 'buy',
};

export const RouteMap = {
  Home: '',
  Settings: '/settings/',
  Pin: '/pin/',
  HoneyPin: '/pin/honey/',
  AddressBook: '/address-book',
  Wallets: '/wallet/list/',
  WalletAdd: '/wallet/add/',
  WalletAddNew: '/wallet/add/new/',
  WalletAddRestore: '/wallet/add/restore/',
  WalletAddReadOnly: '/wallet/add/read-only/',
  WalletAddMultiSig: '/wallet/add/multi-sig/',
  Wallet: '/wallet/:id/*',
  WalletHome: '/wallet/:id/home/',
  WalletTransaction: '/wallet/:id/transaction/',
  WalletTransactionDetail: '/wallet/:id/transaction/:txId',
  WalletAddress: '/wallet/:id/address/',
  WalletAsset: '/wallet/:id/asset/',
  WalletDApps: '/wallet/:id/dApps/',
  WalletDAppView: '/wallet/:id/dApp/:dAppId',
  WalletSettings: '/wallet/:id/settings',
  WalletMultiSig: '/wallet/:id/multi-sig-communication',
  WalletMultiSigTxView: '/wallet/:id/multi-sig-communication/:txId',
  WalletXPub: '/wallet/:id/x-pub',
  WalletChangePassword: '/wallet/:id/password-change',
  WalletSend: '/wallet/:id/send',
  WalletBuy: '/wallet/:id/buy',
  WalletAddressBookAdd: '/address-book/add',
};

export const getRoute = (route: string, args: object) => {
  Object.entries(args).forEach(([key, value]) => {
    route = route.replace(':' + key, value);
  });
  return route;
};
