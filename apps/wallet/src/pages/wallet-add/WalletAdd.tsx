import {
  AddCircleOutlineOutlined,
  FileDownloadTwoTone,
  SettingsBackupRestoreOutlined,
  VisibilityOutlined,
  WorkspacesOutlined,
} from '@mui/icons-material';
import { Stack } from '@mui/material';

import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import AppFrame from '@/layouts/AppFrame';
import { RouteMap } from '@/router/routerMap';

import ItemCard from './components/item-card/ItemCard';

const AddWallet = () => {
  return (
    <AppFrame title="Add Wallet" navigation={<BackButtonRouter />}>
      <Stack spacing={2}>
        <ItemCard
          title="New wallet"
          description="Generate a random mnemonic and create a wallet with it. It can be a cold wallet or a normal wallet"
          path={RouteMap.WalletAddNew}
          icon={<AddCircleOutlineOutlined />}
        />
        <ItemCard
          title="Restore wallet"
          description="Restore a wallet from an existing mnemonic. It can be a cold wallet or a normal wallet"
          path={RouteMap.WalletAddRestore}
          icon={<SettingsBackupRestoreOutlined />}
        />
        <ItemCard
          title="Add read only wallet"
          description="Create a read-only wallet without storing any secret to track and create your transactions. It cannot sign any transaction and you need the corresponding cold wallet for signing."
          path={RouteMap.WalletAddReadOnly}
          icon={<VisibilityOutlined />}
        />
        <ItemCard
          title="Add multi sig wallet"
          description="New Multi-Signature Wallet Create a multi-signature wallet and manage your co-signing wallets."
          path={RouteMap.WalletAddMultiSig}
          icon={<WorkspacesOutlined />}
        />
        <ItemCard
          title="Import Wallets"
          description="Import Wallet from another instance of minotaur."
          path={RouteMap.WalletAddImport}
          icon={<FileDownloadTwoTone />}
        />
      </Stack>
    </AppFrame>
  );
};

export default AddWallet;
