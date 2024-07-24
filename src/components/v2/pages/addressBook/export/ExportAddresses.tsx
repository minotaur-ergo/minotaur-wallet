import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';
import { Button, Stack } from '@mui/material';
import ExportAddressItem from './ExportAddressItem';
import { ADDRESS_BOOK } from '../../../data';
import { AddressBookType, SelectableType } from '../../../models';
import useDrawer from '../../../reducers/useDrawer';
import useSelectList from '../../../reducers/useSelectList';
import ExportDrawer from '../../../components/ExportDrawer';

const getData = () =>
  new Promise<(AddressBookType & SelectableType)[]>((resolve) => {
    resolve(ADDRESS_BOOK);
  });

const ExportAddresses = () => {
  const [handleExport, eportDrawerProps] = useDrawer();
  const { list, selectedCount, handleToggle, SelectAllButton } =
    useSelectList<AddressBookType>(getData, 'address');

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
          <ExportAddressItem key={index} {...item} onChange={handleToggle} />
        ))}
      </Stack>
      <ExportDrawer
        {...eportDrawerProps}
        title={`Address${selectedCount > 1 ? 'es' : ''}`}
        count={selectedCount}
      />
    </AppFrame>
  );
};

export default ExportAddresses;
