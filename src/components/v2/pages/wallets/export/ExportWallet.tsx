import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';
import { Button, Stack } from '@mui/material';
import ExportWalletItem from './ExportWalletItem';
import { WALLETS } from '../../../data';
import { SelectWalletType } from '../../../models';
import useDrawer from '../../../reducers/useDrawer';
import useSelectList from '../../../reducers/useSelectList';
import ExportDrawer from '../../../components/ExportDrawer';

const getData = () =>
  new Promise<SelectWalletType[]>((resolve) => {
    resolve(WALLETS);
  });

const ExportWallet = () => {
  const [handleExport, eportDrawerProps] = useDrawer();
  const { list, selectedCount, handleToggle, setValue, SelectAllButton } =
    useSelectList<SelectWalletType>(getData, 'id');

  return (
    <AppFrame
      title={`${selectedCount} Selected`}
      navigation={<BackButton />}
      actions={<SelectAllButton />}
      toolbar={
        <Button onClick={handleExport} disabled={selectedCount === 0}>
          Export as
        </Button>
      }
    >
      <Stack gap={2}>
        {list.map((item, index) => (
          <ExportWalletItem
            key={index}
            {...item}
            onChange={handleToggle}
            setValue={setValue}
          />
        ))}
      </Stack>
      <ExportDrawer
        {...eportDrawerProps}
        title={`Wallet${selectedCount > 1 ? 's' : ''}`}
        count={selectedCount}
      />
    </AppFrame>
  );
};

export default ExportWallet;
