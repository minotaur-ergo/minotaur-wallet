export const WalletPageSuffix = {
  WalletHome: 'home',
  WalletTransaction: 'transaction',
  WalletAsset: 'asset',
  WalletAddress: 'address',
  WalletDApps: 'dApps',
  WalletDAppView: 'dApp/:dAppId',
  WalletSettings: 'settings',
  WalletXPub: 'x-pub',
  WalletMultiSig: 'multi-sig-communication/',
  WalletMultiSigTxView: 'multi-sig-communication/:txId',
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
  WalletAddress: '/wallet/:id/address/',
  WalletAsset: '/wallet/:id/asset/',
  WalletDApps: '/wallet/:id/dApps/',
  WalletDAppView: '/wallet/:id/dApp/:dAppId',
  WalletSettings: '/wallet/:id/settings',
  WalletMultiSig: '/wallet/:id/multi-sig-communication',
  WalletMultiSigTxView: '/wallet/:id/multi-sig-communication/:txId',
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
