import React, { Fragment, useState } from 'react';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

interface SolitaryTextFieldPropsType {
  value: string;
  onChange: (newValue: string) => unknown;
  label: string;
  helperText?: string;
}

const SolitaryTextField: React.FC<SolitaryTextFieldPropsType> = ({
  value,
  onChange,
  label,
  helperText,
}) => {
  const [open, setOpen] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const handleClose = () => {
    setNewValue(value);
    setOpen(false);
  };
  const handleConfirm = () => {
    if (onChange) {
      onChange(newValue);
    }
    setOpen(false);
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
              <IconButton onClick={() => setOpen(true)} edge="end">
                <EditOutlinedIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputProps={{ readOnly: true }}
      />
      <Drawer anchor="bottom" open={open} onClose={handleClose}>
        <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
          Edit {label?.toLowerCase()}
        </Typography>
        <TextField
          variant="standard"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          helperText={helperText}
          inputProps={{ autoFocus: true }}
        />
        <Stack direction="row-reverse" spacing={2}>
          <Button
            onClick={handleConfirm}
            variant="text"
            fullWidth={false}
            sx={{ px: 0, minWidth: 0 }}
          >
            Save
          </Button>
          <Button
            onClick={handleClose}
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
};

export default SolitaryTextField;
