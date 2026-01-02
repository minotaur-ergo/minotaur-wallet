import { useDispatch, useSelector } from 'react-redux';

import { ConfigType, GlobalStateType } from '@minotaur-ergo/types';
import { getChain, MAIN_NET_LABEL, TEST_NET_LABEL } from '@minotaur-ergo/utils';

import {
  AddressDbAction,
  ConfigDbAction,
  PinDbAction,
  WalletDbAction,
} from '@/action/db';
import { getInitializeData } from '@/action/initialize';
import { ConfigPayload, setConfig, setPinConfig } from '@/store/reducer/config';
import { initialize, setAddresses, setWallets } from '@/store/reducer/wallet';
import { DEFAULT_EXPLORER, DEFAULT_NODE } from '@/utils/const';
import {
  addressEntityToAddressState,
  walletEntityToWalletState,
} from '@/utils/convert';

const useInitConfig = () => {
  const configLoadedPinType = useSelector(
    (state: GlobalStateType) => state.config.loadedPinType,
  );
  const pinLoaded = useSelector(
    (state: GlobalStateType) => state.config.pin.loaded,
  );
  const { walletsValid, loadedWalletPinType } = useSelector(
    (state: GlobalStateType) => state.wallet,
  );
  const addressesValid = useSelector(
    (state: GlobalStateType) => state.wallet.addressesValid,
  );
  const initialized = useSelector(
    (state: GlobalStateType) => state.wallet.initialized,
  );
  const activePinType = useSelector(
    (state: GlobalStateType) => state.config.pin.activePinType,
  );
  const configLoaded = configLoadedPinType === activePinType;
  const dispatch = useDispatch();
  if (!pinLoaded) {
    PinDbAction.getInstance()
      .getAllPins()
      .then((pins) => {
        const hasPin = pins.length > 0;
        dispatch(setPinConfig({ locked: hasPin, hasPin, activeType: '' }));
      });
  } else if (!configLoaded) {
    ConfigDbAction.getInstance()
      .getAllConfig(activePinType)
      .then((configs) => {
        const config: ConfigPayload = {
          display: 'advanced',
          currency: 'USD',
          activeWallet: -1,
          pinType: activePinType,
          useActiveWallet: true,
          mainnetNetworkSetting: {
            network: 'mainnet',
            sync: 'explorer',
            explorerUrl: DEFAULT_EXPLORER.mainnet,
            nodeUrl: DEFAULT_NODE.mainnet,
          },
          testnetNetworkSetting: {
            network: 'testnet',
            sync: 'explorer',
            explorerUrl: DEFAULT_EXPLORER.testnet,
            nodeUrl: DEFAULT_NODE.testnet,
          },
        };
        configs.forEach((item) => {
          if (item.key === ConfigType.DisplayMode && item.value === 'simple') {
            config.display = 'simple';
          } else if (item.key === ConfigType.Currency) {
            config.currency = item.value;
          } else if (item.key === ConfigType.ActiveWallet) {
            config.activeWallet = parseInt(item.value);
          } else if (item.key === ConfigType.useActiveWallet) {
            config.useActiveWallet = item.value !== 'false';
          } else if (item.key === ConfigType.MainnetExplorerUrl) {
            config.mainnetNetworkSetting.explorerUrl = item.value;
          } else if (item.key === ConfigType.TestnetExplorerUrl) {
            config.testnetNetworkSetting.explorerUrl = item.value;
          } else if (item.key === ConfigType.MainnetSyncWithNode) {
            config.mainnetNetworkSetting.sync =
              item.value === 'true' ? 'node' : 'explorer';
          } else if (item.key === ConfigType.TestnetSyncWithNode) {
            config.testnetNetworkSetting.sync =
              item.value === 'true' ? 'node' : 'explorer';
          } else if (item.key === ConfigType.MainnetNodeAddress) {
            config.mainnetNetworkSetting.nodeUrl = item.value;
          } else if (item.key === ConfigType.TestnetNodeAddress) {
            config.testnetNetworkSetting.nodeUrl = item.value;
          }
        });
        getChain(MAIN_NET_LABEL).init(
          config.mainnetNetworkSetting.sync === 'node',
          config.mainnetNetworkSetting.explorerUrl,
          config.mainnetNetworkSetting.nodeUrl,
        );
        getChain(TEST_NET_LABEL).init(
          config.testnetNetworkSetting.sync === 'node',
          config.testnetNetworkSetting.explorerUrl,
          config.testnetNetworkSetting.nodeUrl,
        );
        dispatch(setConfig(config));
      });
  } else if (!initialized) {
    getInitializeData().then((res) => dispatch(initialize(res)));
  } else if (!walletsValid || activePinType !== loadedWalletPinType) {
    WalletDbAction.getInstance()
      .getWallets()
      .then((wallets) => {
        const loadingPinType = activePinType;
        dispatch(
          setWallets({
            wallets: wallets
              .map(walletEntityToWalletState)
              .filter(
                (item) =>
                  activePinType === '' ||
                  item.flags.filter((item) => item.startsWith(loadingPinType))
                    .length > 0,
              ),
            pinType: loadingPinType,
          }),
        );
      });
  } else if (!addressesValid) {
    AddressDbAction.getInstance()
      .getAllAddresses()
      .then((addresses) => {
        dispatch(setAddresses(addresses.map(addressEntityToAddressState)));
      });
  }
  return { initialized: configLoaded && initialized };
};

export default useInitConfig;
