import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import AppFrame from '@/layouts/AppFrame';
import ActionBar from '@/pages/import/ActionBar';
import ImportWalletContextHandler from '@/pages/import/ImportWalletContextHandler';
import WalletsList from '@/pages/import/WalletsList';

import Description from './Description';

const WalletImport = () => {
  return (
    <ImportWalletContextHandler>
      <AppFrame
        title="Import Wallets"
        navigation={<BackButtonRouter />}
        toolbar={<ActionBar />}
      >
        <Description />
        <WalletsList />
      </AppFrame>
    </ImportWalletContextHandler>
  );
};

export default WalletImport;
