import { Fragment, useState } from 'react';

import { Cancel, ManageSearchOutlined } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
  Stack,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

export interface OptionsType {
  label?: string;
  value: string;
}

interface SolitarySelectFieldPropsType {
  value: string;
  onChange: (newValue: string) => unknown;
  label: string;
  helperText?: string;
  options: OptionsType[];
  onOpen?: () => void;
  showSearch?: boolean;
}

const SolitarySelectField = (props: SolitarySelectFieldPropsType) => {
  const [open, setOpen] = useState(false);
  const [newValue, setNewValue] = useState(props.value);
  const [searchVal, setSearchVal] = useState<string>('');

  const handleClose = () => {
    setOpen(false);
    setNewValue(props.value);
  };
  const handleConfirm = () => {
    if (props.onChange) {
      props.onChange(newValue);
    }
    setOpen(false);
  };
  const handleSelectOption = (optionValue: string) => () => {
    setNewValue(optionValue);
  };

  return (
    <Fragment>
      <TextField
        label={props.label}
        value={props.value}
        helperText={props.helperText}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  if (props.onOpen) {
                    props.onOpen();
                  }
                  setOpen(true);
                }}
                edge="end"
              >
                <KeyboardArrowDownIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputProps={{ readOnly: true }}
      />
      <Drawer anchor="bottom" open={open} onClose={handleClose}>
        <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
          Select {props.label?.toLowerCase()}
        </Typography>
        {props.showSearch && (
          <TextField
            sx={{
              '& .MuiInputBase-input': {
                marginBottom: '12px',
              },
            }}
            placeholder="Search"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ManageSearchOutlined sx={{ fontSize: 30, mb: 2 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setSearchVal('');
                    }}
                    edge="end"
                    size="small"
                  >
                    <Cancel />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputProps={{ autoFocus: true, autoComplete: 'off' }}
          />
        )}
        <div style={{ overflowY: 'auto' }}>
          <List disablePadding>
            {props.options
              .filter((o) =>
                o.value.toLowerCase().includes(searchVal.toLowerCase()),
              )
              .map((opt, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={handleSelectOption(opt.value)}
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
                        sx={{ ml: 1 }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={opt.label || opt.value} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </div>
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

export default SolitarySelectField;
