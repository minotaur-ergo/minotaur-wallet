import { changeWalletPassword, validatePassword } from '@/action/wallet';
import MessageContext from '@/components/app/messageContext';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import PasswordField from '@/components/password-field/PasswordField';
import AppFrame from '@/layouts/AppFrame';
import { StateWallet } from '@/store/reducer/wallet';
import { Button, Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ChangeWalletPasswordPropsType {
  wallet: StateWallet;
}
const ChangeWalletPassword = (props: ChangeWalletPasswordPropsType) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [changing, setChanging] = useState(false);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();
  const message = useContext(MessageContext);
  useEffect(() => {
    const oldPassValid = validatePassword(props.wallet.seed, oldPassword);
    const newPassValid = newPasswordConfirm === newPassword;
    const passValid = oldPassValid && newPassValid;
    if (passValid === hasError) {
      setHasError(!passValid);
    }
  }, [props.wallet, oldPassword, newPassword, newPasswordConfirm, hasError]);
  const handleSubmit = () => {
    setChanging(true);
    changeWalletPassword(props.wallet.id, oldPassword, newPassword).then(() => {
      message.insert('successfully changed', 'success');
      navigate(-1);
    });
  };
  return (
    <AppFrame
      title="Change password"
      navigation={<BackButtonRouter />}
      toolbar={
        <Button disabled={hasError} onClick={handleSubmit}>
          {changing ? (
            <CircularProgress size={20} className="color-white" />
          ) : null}{' '}
          Submit
        </Button>
      }
    >
      <Stack spacing={2}>
        <PasswordField
          password={oldPassword}
          setPassword={setOldPassword}
          label="Wallet Password"
        />
        <PasswordField
          password={newPassword}
          setPassword={setNewPassword}
          label="New Password"
        />
        <PasswordField
          password={newPasswordConfirm}
          setPassword={setNewPasswordConfirm}
          label="Confirm New Password"
        />
      </Stack>
    </AppFrame>
  );
};

export default ChangeWalletPassword;
