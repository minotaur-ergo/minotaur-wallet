import { Card, Checkbox, Typography } from '@mui/material';
import DisplayId from '../../../components/DisplayId';
import { ChangeEvent } from 'react';
import { AddressType } from './ExportAddresses';

interface PropsType {
  name?: string;
  address?: string;
  selected?: boolean;
  onChange: (address: AddressType, checked: boolean) => any;
}

export default function ({
  name = '',
  address = '',
  selected,
  onChange,
}: PropsType) {
  const handle_change = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ name, address }, event.target.checked);

  return (
    <label>
      <Checkbox
        sx={{ position: 'absolute', mt: 2 }}
        checked={selected}
        onChange={handle_change}
      />
      <Card sx={{ p: 2, ml: 6 }}>
        <Typography>{name}</Typography>
        <DisplayId variant="body2" color="textSecondary" id={address} />
      </Card>
    </label>
  );
}
