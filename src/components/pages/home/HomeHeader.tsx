import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { RouteMap } from '../../route/routerMap';
import { Capacitor } from '@capacitor/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faGear } from '@fortawesome/free-solid-svg-icons';

const downloadDb = () => {
  try {
    const content = Buffer.from(
      JSON.parse(localStorage.minotaur)
        .map((item: number) => ('0' + item.toString(16)).slice(-2))
        .join(''),
      'hex'
    );
    const filename = 'db.sqlite3';
    const blob = new Blob([content], {
      type: 'octet/stream',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
  }
};

const HomeHeader = () => {
  const navigate = useNavigate();
  const addWalletClickHandler = () => {
    navigate(RouteMap.WalletAdd);
  };

  return (
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {' '}
        Minotaur{' '}
      </Typography>
      {/*<IconButton color="inherit" onClick={() => navigate(RouteMap.DAppConnector)}>*/}
      {/*    <FontAwesomeIcon icon={faHandshake} size={"xs"}/>*/}
      {/*</IconButton>*/}
      <IconButton color="inherit" onClick={() => navigate(RouteMap.Settings)}>
        <FontAwesomeIcon icon={faGear} size={'xs'} />
      </IconButton>
      <IconButton color="inherit" onClick={addWalletClickHandler}>
        <AddIcon />
      </IconButton>
      {Capacitor.getPlatform() === 'web' ? (
        <IconButton color="inherit" onClick={downloadDb}>
          <FontAwesomeIcon icon={faDownload} size={'xs'} />
        </IconButton>
      ) : null}
    </Toolbar>
  );
};

export default HomeHeader;
