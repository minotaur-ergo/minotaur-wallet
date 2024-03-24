import { useDispatch, useSelector } from 'react-redux';
import { AddressDbAction, ConfigDbAction, WalletDbAction } from '@/action/db';
import { getInitializeData } from '@/action/initialize';
import { ConfigType } from '@/db/entities/Config';
import { GlobalStateType } from '@/store';
import { ConfigPayload, setConfig } from '@/store/reducer/config';
import { initialize, setAddresses, setWallets } from '@/store/reducer/wallet';
import {
  addressEntityToAddressState,
  walletEntityToWalletState,
} from '@/utils/convert';

const useInitConfig = () => {
  const configLoaded = useSelector(
    (state: GlobalStateType) => state.config.loaded,
  );
  const walletsValid = useSelector(
    (state: GlobalStateType) => state.wallet.walletsValid,
  );
  const addressesValid = useSelector(
    (state: GlobalStateType) => state.wallet.addressesValid,
  );
  const initialized = useSelector(
    (state: GlobalStateType) => state.wallet.initialized,
  );
  const dispatch = useDispatch();
  if (!configLoaded) {
    ConfigDbAction.getInstance()
      .getAllConfig()
      .then((configs) => {
        const config: ConfigPayload = {
          display: 'advanced',
          currency: 'USD',
          activeWallet: -1,
        };
        configs.forEach((item) => {
          if (
            item.key === ConfigType.DisplayMode &&
            item.value === 'simple'
          ) {
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
  } else if (!walletsValid) {
    WalletDbAction.getInstance()
      .getWallets()
      .then((wallets) => {
        dispatch(setWallets(wallets.map(walletEntityToWalletState)));
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
