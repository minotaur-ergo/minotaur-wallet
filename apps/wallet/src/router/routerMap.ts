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
  WalletMultiSigRegistration: 'multi-sig-communication/server/registration',
  WalletMultiSig: 'multi-sig-communication/:type',
  WalletMultiSigTxView: 'multi-sig-communication/:type/:txId',
  WalletSend: 'send',
};

export const RouteMap = {
  Home: '',
  Settings: '/settings/',
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
  WalletMultiSigRegistration:
    '/wallet/:id/multi-sig-communication/server/registration',
  WalletMultiSig: '/wallet/:id/multi-sig-communication/:type/',
  WalletMultiSigTxView: '/wallet/:id/multi-sig-communication/:type/:txId',
  WalletXPub: '/wallet/:id/x-pub',
  WalletSend: '/wallet/:id/send',
  WalletAddressBookAdd: '/address-book/add',
};

export const getRoute = (route: string, args: object) => {
  Object.entries(args).forEach(([key, value]) => {
    route = route.replace(':' + key, value);
  });
  return route;
};
