export const WalletPageSuffix = {
  WalletTransaction: 'transaction',
  WalletSend: 'send',
  WalletAddress: 'address/',
  WalletMultiSig: 'multi-sig/',
  WalletAssets: 'assets/',
  WalletAddressView: 'address/:address_id',
  WalletDApps: 'dApp',
  WalletDAppView: 'dApp/:dAppId',
};

export const RouteMap = {
  Home: '/',
  Settings: '/settings',
  DAppConnector: '/dapp-connector',
  WalletAdd: '/wallet/add/',
  Wallet: '/wallet/:id/*',
  WalletTransaction: '/wallet/:id/transaction',
  WalletSend: '/wallet/:id/send',
  WalletMultiSig: '/wallet/:id/multi-sig/',
  WalletAddress: '/wallet/:id/address/',
  WalletAssets: '/wallet/:id/assets/',
  WalletAddressView: '/wallet/:id/address/:address_id',
  WalletDApps: '/wallet/:id/dApp',
  WalletDAppView: '/wallet/:id/dApp/:dAppId',
  QrCode: '/qrcode',
};

export const getRoute = (route: string, args: object) => {
  Object.entries(args).forEach(([key, value]) => {
    route = route.replace(':' + key, value);
  });
  return route;
};
