import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackIcon from '@mui/icons-material/ArrowBackIos';
import { IconButton } from '@mui/material';
import { RouterMap } from '../V2Demo';

interface PropsType {
  onClick?(): void;
  backHome?: boolean;
}

export default function BackButton(props: PropsType) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (props.onClick) props.onClick();
    else if (props.backHome) navigate(RouterMap.Home);
    else navigate(-1);
  };

  return (
    <IconButton onClick={handleBack}>
      <BackIcon />
    </IconButton>
  );
}
