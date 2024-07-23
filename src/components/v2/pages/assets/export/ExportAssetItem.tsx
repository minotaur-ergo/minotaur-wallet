import { Box, Checkbox } from '@mui/material';
import { ChangeEvent } from 'react';
import { AssetType, SelectableType } from '../../../models';
import AssetCard from '../AssetCard';

interface PropsType extends SelectableType {
  asset: AssetType;
  onChange: (id: AssetType['id'], checked: boolean) => any;
}

export default function ExportAssetItem({
  asset,
  selected = false,
  onChange,
}: PropsType) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(asset.id, event.target.checked);

  return (
    <Box component="label" display="flex" gap={2}>
      <Checkbox checked={selected} onChange={handleChange} />
      <AssetCard {...asset} />
    </Box>
  );
}
