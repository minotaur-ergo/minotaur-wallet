import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface HeadingPropsType {
  title: string;
  actionLabel?: string;
  actionPath?: string;
  disabled?: boolean;
  customActions?: React.ReactNode;
}

const Heading = (props: HeadingPropsType) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (props.actionPath) {
      navigate(props.actionPath);
    }
  };
  return (
    <Box display="flex">
      <Typography variant="h2" sx={{ py: '0.75rem' }}>
        {props.title}
      </Typography>
      {props.actionLabel && (
        <Button
          variant="text"
          onClick={handleClick}
          fullWidth={false}
          disabled={props.disabled}
          size="small"
          sx={{ px: 0, minWidth: 48 }}
        >
          {props.actionLabel}
        </Button>
      )}
      {props.customActions}
    </Box>
  );
};

export default Heading;
