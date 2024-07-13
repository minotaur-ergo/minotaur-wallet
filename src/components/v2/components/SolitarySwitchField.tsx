import React, { Fragment, ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Switch } from '@mui/material';

interface PropsType {
  value: boolean;
  onChange: (checked: boolean) => any;
  label: string;
  helperText?: string;
  checkedDescription?: string;
  uncheckedDescription?: string;
  disabled?: boolean;
}

export default function ({
  value,
  onChange,
  label,
  helperText,
  checkedDescription = 'On',
  uncheckedDescription = 'Off',
  disabled,
}: PropsType) {
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
              <Switch
                checked={value}
                onChange={handle_change}
                edge="end"
                disabled={disabled}
              />
            </InputAdornment>
          ),
        }}
        inputProps={{ readOnly: true }}
      />
    </Fragment>
  );
}
