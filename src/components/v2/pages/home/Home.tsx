import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <AppFrame
      title="Home"
      navigation={
        <IconButton onClick={() => navigate('/v2/wallets')}>
          <AccountBalanceWalletOutlinedIcon />
        </IconButton>
      }
      actions={
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      }
      toolbar={
        <Button variant="contained" fullWidth>
          Next
        </Button>
      }
    >
      Hello
      <p>
        Do: You can mix fluid columns with fixed, if you like. Fluid columns
        will adapt to the size of the container left for them. You can also use
        columns whose total width exceeds 12 (100%). The remaining content will
        flow below the rest, allowing you to specify multiple blocks of content
        inside the same row if you need to.
      </p>
      <p>
        A column can contain a container or a row inside it, or even be a row at
        the same time. In the latter case, it will act as a column for its
        parent row and as a row for its children.
      </p>
      <p>
        You can change the layout of your content for different displays, laying
        out your content vertically on smaller screens or horizontally on larger
        screens. If your columns exceed a total width of 12 (100%) on some
        displays, they will wrap accordingly.
      </p>
      <p>
        Do: You can mix fluid columns with fixed, if you like. Fluid columns
        will adapt to the size of the container left for them. You can also use
        columns whose total width exceeds 12 (100%). The remaining content will
        flow below the rest, allowing you to specify multiple blocks of content
        inside the same row if you need to.
      </p>
      <p>
        A column can contain a container or a row inside it, or even be a row at
        the same time. In the latter case, it will act as a column for its
        parent row and as a row for its children.
      </p>
      <p>
        You can change the layout of your content for different displays, laying
        out your content vertically on smaller screens or horizontally on larger
        screens. If your columns exceed a total width of 12 (100%) on some
        displays, they will wrap accordingly.
      </p>
      <p>
        Do: You can mix fluid columns with fixed, if you like. Fluid columns
        will adapt to the size of the container left for them. You can also use
        columns whose total width exceeds 12 (100%). The remaining content will
        flow below the rest, allowing you to specify multiple blocks of content
        inside the same row if you need to.
      </p>
      <p>
        A column can contain a container or a row inside it, or even be a row at
        the same time. In the latter case, it will act as a column for its
        parent row and as a row for its children.
      </p>
      <p>
        You can change the layout of your content for different displays, laying
        out your content vertically on smaller screens or horizontally on larger
        screens. If your columns exceed a total width of 12 (100%) on some
        displays, they will wrap accordingly.
      </p>
      Bye
    </AppFrame>
  );
};

export default Home;
