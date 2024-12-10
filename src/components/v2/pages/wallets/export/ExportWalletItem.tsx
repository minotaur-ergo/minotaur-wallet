import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { ChangeEvent } from 'react';
import { SelectableType, SelectWalletType } from '../../../models';

interface PropsType extends SelectWalletType, SelectableType {
  onChange: (id: string, checked: boolean) => any;
  setValue: (id: string, value: Partial<SelectWalletType>) => any;
}

export default function ({
  id,
  name,
  selected = false,
  withSecret = false,
  onChange,
  setValue,
}: PropsType) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(id, event.target.checked);
  const handleToggleSecret = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setValue(id, { withSecret: checked, ...(checked && { selected: true }) });
  };

  return (
    <Box component="label" display="flex" gap={2}>
      <Checkbox checked={selected} onChange={handleChange} />
      <Card sx={{ p: 2, flexGrow: 1 }}>
        <Typography>{name}</Typography>
        <FormControlLabel
          checked={withSecret}
          control={<Switch size="small" onChange={handleToggleSecret} />}
          label={`${withSecret ? 'With' : 'Without'} secret`}
          slotProps={{
            typography: {
              fontSize: 'small',
              color: withSecret ? 'text.primary' : 'text.secondary',
            },
          }}
        />
      </Card>
    </Box>
  );
}
