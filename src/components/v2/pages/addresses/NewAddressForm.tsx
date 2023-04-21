import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Button,
  styled,
  TextField,
  Collapse,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Add, Check, Close } from '@mui/icons-material';

const Container = styled(Box)(
  ({ theme }) => `
  position: absolute;
  bottom: 74px;
  right: ${theme.spacing(3)};
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 16px;
  & .MuiInputBase-root {
    background-color: #fff;
    box-shadow: ${theme.shadows[2]};
  }
`
);

const CircleButton = styled(Button)(
  ({ theme }) => `
  min-width: 56px;
  width: 56px;
  border-radius: 56px;
  box-shadow: ${theme.shadows[2]}!important;
`
);

const NewAddressForm = () => {
  const [open, set_open] = useState(false);
  const [loading, set_loading] = useState(false);
  const [name, set_name] = useState('');

  const handle_change_name = (e: React.ChangeEvent<HTMLInputElement>) => {
    set_name(e.target.value);
  };
  const handle_reset = () => {
    set_open(false);
    set_name('');
  };
  const handle_new = () => {
    if (open) {
      set_loading(true);
      setTimeout(() => {
        set_loading(false);
        handle_reset();
      }, 1000);
    } else {
      set_open(true);
    }
  };

  return (
    <Container>
      <CircleButton onClick={handle_new} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : open ? <Check /> : <Add />}
      </CircleButton>
      <Collapse in={open} orientation={'horizontal'}>
        <TextField
          label="New Address Name"
          value={name}
          onChange={handle_change_name}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handle_reset} edge="end">
                  <Close />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Collapse>
    </Container>
  );
};

export default NewAddressForm;
