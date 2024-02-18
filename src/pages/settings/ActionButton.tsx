import { ReactElement } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export interface ActionButtonPropsType {
  label: string;
  onClick?: () => void;
  helperText?: string;
  icon?: ReactElement;
}

const ActionButton = (props: ActionButtonPropsType) => {
  return (
    <Box px={1.5}>
      <Box display="flex" sx={{ alignItems: 'center' }}>
        <Typography sx={{ flexGrow: 1 }}>{props.label}</Typography>
        <IconButton
          edge="end"
          onClick={props.onClick}
          disabled={!props.onClick}
        >
          {props.icon ?? <ChevronRightIcon />}
        </IconButton>
      </Box>
      {props.helperText && (
        <Typography
          color="textSecondary"
          fontSize="0.75rem"
          letterSpacing="0.03333em"
          sx={{ mt: -1 }}
        >
          {props.helperText}
        </Typography>
      )}
    </Box>
  );
};

export default ActionButton;
