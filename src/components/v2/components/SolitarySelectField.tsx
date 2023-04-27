import React, { useState, Fragment } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Radio,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface OptionsType {
  label?: string;
  value: string;
}
interface PropsType {
  value: string;
  onChange: (newValue: string) => any;
  label: string;
  helperText?: string;
  options: OptionsType[];
}

export default function ({
  value,
  onChange,
  label,
  helperText,
  options,
}: PropsType) {
  const [open, set_open] = useState(false);
  const [newValue, set_newValue] = useState(value);

  const handle_close = () => {
    set_open(false);
    set_newValue(value);
  };
  const handle_confirm = () => {
    if (onChange) {
      onChange(newValue);
    }
    set_open(false);
  };
  const handle_select_option = (optionValue: string) => () => {
    set_newValue(optionValue);
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
                <KeyboardArrowDownIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputProps={{ readOnly: true }}
      />
      <Drawer anchor="bottom" open={open} onClose={handle_close}>
        <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
          Select {label?.toLowerCase()}
        </Typography>
        <List disablePadding>
          {options.map((opt, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={handle_select_option(opt.value)}
                role={undefined}
                disableGutters
                dense
              >
                <ListItemIcon>
                  <Radio
                    edge="start"
                    checked={opt.value === newValue}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={opt.label || opt.value} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
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
