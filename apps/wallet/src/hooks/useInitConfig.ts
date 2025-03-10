import { useDispatch, useSelector } from 'react-redux';
import {
  AddressDbAction,
  ConfigDbAction,
  PinDbAction,
  WalletDbAction,
} from '@/action/db';
import { getInitializeData } from '@/action/initialize';
import { ConfigType } from '@/db/entities/Config';
import { GlobalStateType } from '@/store';
import { ConfigPayload, setConfig, setPinConfig } from '@/store/reducer/config';
import { initialize, setAddresses, setWallets } from '@/store/reducer/wallet';
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
        };
        configs.forEach((item) => {
          if (item.key === ConfigType.DisplayMode && item.value === 'simple') {
            config.display = 'simple';
          } else if (item.key === ConfigType.Currency) {
            config.currency = item.value;
          } else if (item.key === ConfigType.ActiveWallet) {
            config.activeWallet = parseInt(item.value);
          }
        });
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
