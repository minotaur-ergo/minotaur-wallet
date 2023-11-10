import { Avatar, Button, Typography } from '@mui/material';
import AppFrame from '../../../layouts/AppFrame';
import { useMemo, useState } from 'react';
import BackButton from '../../../components/BackButton';
import BackdropLoading from '../../../components/BackdropLoading';

const DAppConnector = () => {
  const [code, setCode] = useState<null | string>(null);
  const [waiting, setWaiting] = useState(false);
  const isConfirmed = useMemo(() => code != null, [code]);

  const handleConnect = () => {
    setWaiting(true);
    setTimeout(() => {
      setCode(Math.floor(Math.random() * 1e6).toFixed());
      setWaiting(false);
    }, 1000);
  };

  return (
    <AppFrame
      title="dApp Connector"
      navigation={<BackButton backHome />}
      toolbar={
        !isConfirmed ? (
          <Button onClick={handleConnect}>Connect</Button>
        ) : undefined
      }
    >
      {isConfirmed ? (
        <>
          <Typography variant="body2">
            Describe more here if needed. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, Ut enim ad minim veniam.
          </Typography>
          <Typography
            textAlign="center"
            letterSpacing="0.4rem"
            fontSize="1.5rem"
            sx={{ my: 4 }}
          >
            {code}
          </Typography>
        </>
      ) : (
        <>
          <Avatar sx={{ mx: 'auto', width: 64, height: 64 }} />
          <Typography textAlign="center" sx={{ mt: 2, mb: 4, px: 2 }}>
            URL Lorem ipsum dolor sit amet consectetur adipiscing elit
          </Typography>
          <Typography variant="body2">
            Describe more here if needed. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </Typography>
        </>
      )}

      <BackdropLoading open={waiting} />
    </AppFrame>
  );
};

export default DAppConnector;
