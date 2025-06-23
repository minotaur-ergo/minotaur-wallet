import React, { ChangeEvent, Fragment } from 'react';

import { Switch } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

interface SolitarySwitchFieldPropsType {
  value: boolean;
  onChange: (checked: boolean) => unknown;
  label: string;
  helperText?: string;
  checkedDescription?: string;
  uncheckedDescription?: string;
}

const SolitarySwitchField: React.FC<SolitarySwitchFieldPropsType> = ({
  value,
  onChange,
  label,
  helperText,
  checkedDescription = 'ON',
  uncheckedDescription = 'OFF',
}) => {
  const handle_change = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked);
    }
  };
  return (
    <Fragment>
      <TextField
        label={label}
        value={value ? checkedDescription : uncheckedDescription}
        helperText={helperText}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Switch checked={value} onChange={handle_change} edge="end" />
            </InputAdornment>
          ),
        }}
        inputProps={{ readOnly: true }}
      />
    </Fragment>
  );
};

export default SolitarySwitchField;
