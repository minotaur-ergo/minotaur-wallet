import { useState, Fragment } from 'react';
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

interface SolitarySelectFieldPropsType {
  value: string;
  onChange: (newValue: string) => unknown;
  label: string;
  helperText?: string;
  options: OptionsType[];
}

const SolitarySelectField = (props: SolitarySelectFieldPropsType) => {
  const [open, setOpen] = useState(false);
  const [newValue, setNewValue] = useState(props.value);

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
              <IconButton onClick={() => setOpen(true)} edge="end">
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
        <List disablePadding>
          {props.options.map((opt, index) => (
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
                  />
                </ListItemIcon>
                <ListItemText primary={opt.label || opt.value} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
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
