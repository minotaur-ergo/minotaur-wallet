import { Button, Typography } from '@mui/material';
import AppFrame from '../../layouts/AppFrame';
import { useNavigate } from 'react-router-dom';
import { RouterMap } from '../../V2Demo';
import PasswordField from '../../components/PasswordField';

const EnterPin = () => {
  const navigate = useNavigate();

  const handle_submit = () => navigate(RouterMap.Home);

  return (
    <AppFrame
      title="Enter Pin"
      toolbar={<Button onClick={handle_submit}>Enter</Button>}
    >
      <Typography mb={2}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex ea commodo consequat.
      </Typography>
      <PasswordField label="Pin" />
    </AppFrame>
  );
};

export default EnterPin;
