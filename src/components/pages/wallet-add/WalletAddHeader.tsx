import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

interface PropsType {
  title: string | React.ReactElement;
}

const WalletAddHeader = (props: PropsType) => {
  const navigate = useNavigate();
  const back = () => {
    navigate(-1);
  };
  return (
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={back}>
        <ArrowBack />
      </IconButton>
      <Typography variant="h6">{props.title}</Typography>
    </Toolbar>
  );
};

export default WalletAddHeader;
