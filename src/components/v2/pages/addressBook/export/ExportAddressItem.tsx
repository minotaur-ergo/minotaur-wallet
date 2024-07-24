import { Box, Card, Checkbox, Typography } from '@mui/material';
import DisplayId from '../../../components/DisplayId';
import { ChangeEvent } from 'react';
import { AddressBookType, SelectableType } from '../../../models';

interface PropsType extends AddressBookType, SelectableType {
  onChange: (id: AddressBookType['address'], checked: boolean) => any;
}

export default function ({
  address,
  name,
  selected = false,
  onChange,
}: PropsType) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(address, event.target.checked);

  return (
    <Box component="label" display="flex" gap={2}>
      <Checkbox checked={selected} onChange={handleChange} />
      <Card sx={{ p: 2 }}>
        <Typography>{name}</Typography>
        <DisplayId variant="body2" color="textSecondary" id={address} />
      </Card>
    </Box>
  );
}
