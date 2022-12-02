import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { IconButton } from '@mui/material';

interface PropsType {
  onClick?(): void;
}

export default function BackButton(props: PropsType) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (props.onClick) props.onClick();
    else navigate(-1);
  };

  return (
    <IconButton onClick={handleBack}>
      <ChevronLeftIcon />
    </IconButton>
  );
}
