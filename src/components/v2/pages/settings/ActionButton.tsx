import React, { ReactElement } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface PropsType {
  label: string;
  onClick?: () => void;
  helperText?: string;
  icon?: ReactElement;
}

export default function ({ label, onClick, helperText, icon }: PropsType) {
  return (
    <Box px={1.5}>
      <Box display="flex" sx={{ alignItems: 'center' }}>
        <Typography sx={{ flexGrow: 1 }}>{label}</Typography>
        <IconButton edge="end" onClick={onClick} disabled={!onClick}>
          {icon ?? <ChevronRightIcon />}
        </IconButton>
      </Box>
      {helperText && (
        <Typography
          color="textSecondary"
          fontSize="0.75rem"
          letterSpacing="0.03333em"
          sx={{ mt: -1 }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
