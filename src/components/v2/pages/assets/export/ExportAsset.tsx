import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';
import { Button, Stack } from '@mui/material';
import ExportAssetItem from './ExportAssetItem';
import { ASSETS } from '../../../data';
import { AssetType, SelectableType } from '../../../models';
import useDrawer from '../../../reducers/useDrawer';
import ExportDrawer from '../../../components/ExportDrawer';
import useSelectList from '../../../reducers/useSelectList';

const getData = () =>
  new Promise<(AssetType & SelectableType)[]>((resolve) => {
    resolve(ASSETS);
  });

const ExportAsset = () => {
  const [handleExport, eportDrawerProps] = useDrawer();
  const { list, selectedCount, handleToggle, SelectAllButton } =
    useSelectList<AssetType>(getData, 'id');

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
          <ExportAssetItem
            key={index}
            asset={item}
            selected={item.selected}
            onChange={handleToggle}
          />
        ))}
      </Stack>
      <ExportDrawer
        {...eportDrawerProps}
        title={`Asset${selectedCount > 1 ? 's' : ''}`}
        count={selectedCount}
      />
    </AppFrame>
  );
};

export default ExportAsset;
