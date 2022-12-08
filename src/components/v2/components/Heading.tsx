import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface PropsType {
  title: string;
  actionLabel?: string;
  actionPath?: string;
  disabled?: boolean;
}

export default function ({
  title,
  actionLabel,
  actionPath,
  disabled = false,
}: PropsType) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (actionPath) {
      navigate(actionPath);
    }
  };
  return (
    <Box display="flex">
      <Typography variant="h2" sx={{ py: '0.75rem' }}>
        {title}
      </Typography>
      {actionLabel && (
        <Button
          variant="text"
          onClick={handleClick}
          fullWidth={false}
          disabled={disabled}
          sx={{ px: 0, minWidth: 48 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
