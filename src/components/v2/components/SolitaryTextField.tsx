import React, { useState, Fragment } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { Stack, Typography } from '@mui/material';

interface PropsType {
  value: string;
  onChange: (newValue: string) => any;
  label: string;
  helperText?: string;
}

export default function ({ value, onChange, label, helperText }: PropsType) {
  const [open, set_open] = useState(false);
  const [newValue, set_newValue] = useState(value);

  const handle_close = () => {
    set_newValue(value);
    set_open(false);
  };
  const handle_confirm = () => {
    if (onChange) {
      onChange(newValue);
    }
    set_open(false);
  };

  return (
    <Fragment>
      <TextField
        label={label}
        value={value}
        helperText={helperText}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => set_open(true)} edge="end">
                <EditOutlinedIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputProps={{ readOnly: true }}
      />
      <Drawer anchor="bottom" open={open} onClose={handle_close}>
        <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
          Edit {label?.toLowerCase()}
        </Typography>
        <TextField
          variant="standard"
          value={newValue}
          onChange={(e) => set_newValue(e.target.value)}
          helperText={helperText}
          inputProps={{ autoFocus: true }}
        />
        <Stack direction="row-reverse" spacing={2}>
          <Button
            onClick={handle_confirm}
            variant="text"
            fullWidth={false}
            sx={{ px: 0, minWidth: 0 }}
          >
            Save
          </Button>
          <Button
            onClick={handle_close}
            variant="text"
            fullWidth={false}
            sx={{ px: 0, minWidth: 0 }}
          >
            Cancel
          </Button>
        </Stack>
      </Drawer>
    </Fragment>
  );
}
