import { Grid } from '@mui/material';
import HomeFrame from '@/layouts/HomeFrame';
import { StateWallet } from '@/store/reducer/wallet';
import { apps } from './apps/dapps';
import { RouteMap, getRoute } from '@/router/routerMap';
import DAppsItemCard from '@/components/dapps-item-card/DAppsItemCard';
import getChain from '@/utils/networks';

interface WalletDAppsPropsType {
  wallet: StateWallet;
}

const WalletDApps = (props: WalletDAppsPropsType) => {
  const chain = getChain(props.wallet.networkType);
  const networkApps = apps.filter((item) =>
    item.networks.includes(chain.prefix),
  );
  return (
    <HomeFrame id={props.wallet.id} title={props.wallet.name}>
      <Grid container spacing={3}>
        {networkApps.map((item) => (
          <Grid item xs={6} key={`dapp-${item.id}`}>
            <DAppsItemCard
              color={item.color}
              icon={item.icon}
              title={item.name}
              description={item.description}
              path={getRoute(RouteMap.WalletDAppView, {
                id: props.wallet.id,
                dAppId: item.id,
              })}
            />
          </Grid>
        ))}
      </Grid>
    </HomeFrame>
  );
};

export default WalletDApps;
