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
          network: {
            mainnet: {
              sync: 'Explorer',
              explorerUrl: DEFAULT_EXPLORER.mainnet,
              nodeUrl: DEFAULT_NODE.mainnet,
              submitTX: 'Explorer',
            },
            testnet: {
              sync: 'Explorer',
              explorerUrl: DEFAULT_EXPLORER.testnet,
              nodeUrl: DEFAULT_NODE.testnet,
              submitTX: 'Explorer',
            },
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
            config.network.mainnet.explorerUrl = item.value;
          } else if (item.key === ConfigType.TestnetExplorerUrl) {
            config.network.testnet.explorerUrl = item.value;
          } else if (item.key === ConfigType.MainnetSync) {
            config.network.mainnet.sync =
              item.value === 'Node' ? 'Node' : 'Explorer';
          } else if (item.key === ConfigType.TestnetSync) {
            config.network.testnet.sync =
              item.value === 'Node' ? 'Node' : 'Explorer';
          } else if (item.key === ConfigType.MainnetNodeUrl) {
            config.network.mainnet.nodeUrl = item.value;
          } else if (item.key === ConfigType.TestnetNodeUrl) {
            config.network.testnet.nodeUrl = item.value;
          } else if (item.key === ConfigType.MainnetSubmitTX) {
            config.network.mainnet.submitTX =
              item.value === 'Node' ? 'Node' : 'Explorer';
          } else if (item.key === ConfigType.TestnetSubmitTX) {
            config.network.testnet.submitTX =
              item.value === 'Node' ? 'Node' : 'Explorer';
          }
        });
        getChain(MAIN_NET_LABEL).init(
          config.network.mainnet.sync === 'Node',
          config.network.mainnet.explorerUrl,
          config.network.mainnet.nodeUrl,
        );
        getChain(TEST_NET_LABEL).init(
          config.network.testnet.sync === 'Node',
          config.network.testnet.explorerUrl,
          config.network.testnet.nodeUrl,
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
