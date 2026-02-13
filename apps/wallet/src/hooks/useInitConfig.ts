import { useDispatch, useSelector } from 'react-redux';

import {
  ConfigType,
  EXPLORER_NETWORK,
  GlobalStateType,
  MAIN_NET_LABEL,
  NETWORK_BACKEND,
  TEST_NET_LABEL,
} from '@minotaur-ergo/types';
import { setUrl } from '@minotaur-ergo/utils';

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
              backend: NETWORK_BACKEND.EXPLORER,
              explorer: DEFAULT_EXPLORER.mainnet,
              node: DEFAULT_NODE.mainnet,
            },
            testnet: {
              backend: NETWORK_BACKEND.EXPLORER,
              explorer: DEFAULT_EXPLORER.testnet,
              node: DEFAULT_NODE.testnet,
            },
          },
        };
        configs.forEach((item) => {
          switch (item.key) {
            case ConfigType.DisplayMode:
              config.display = item.value === 'simple' ? 'simple' : 'advanced';
              break;
            case ConfigType.Currency:
              config.currency = item.value;
              break;
            case ConfigType.ActiveWallet:
              config.activeWallet = parseInt(item.value);
              break;
            case ConfigType.UseActiveWallet:
              config.useActiveWallet = item.value !== 'false';
              break;
            case ConfigType.MainnetBackend:
              config.network.mainnet.backend =
                item.value === EXPLORER_NETWORK
                  ? NETWORK_BACKEND.EXPLORER
                  : NETWORK_BACKEND.NODE;
              break;
            case ConfigType.MainnetNodeUrl:
              config.network.mainnet.node = item.value;
              break;
            case ConfigType.MainnetExplorerUrl:
              config.network.mainnet.explorer = item.value;
              break;
            case ConfigType.TestnetBackend:
              config.network.testnet.backend =
                item.value === EXPLORER_NETWORK
                  ? NETWORK_BACKEND.EXPLORER
                  : NETWORK_BACKEND.NODE;
              break;
            case ConfigType.TestnetNodeUrl:
              config.network.testnet.node = item.value;
              break;
            case ConfigType.TestnetExplorerUrl:
              config.network.testnet.explorer = item.value;
              break;
          }
        });
        setUrl(MAIN_NET_LABEL, config.network.mainnet);
        setUrl(TEST_NET_LABEL, config.network.testnet);
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
