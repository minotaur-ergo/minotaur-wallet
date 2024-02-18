import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface HeadingPropsType {
  title: string;
  actionLabel?: string;
  actionPath?: string;
  disabled?: boolean;
}

const Heading: React.FC<HeadingPropsType> = ({
  title,
  actionLabel,
  actionPath,
  disabled = false,
}) => {
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
};

export default Heading;
