import React, { useContext, useState } from 'react';

import {
  QrCodeScannedComponentPropsType,
  StateWallet,
} from '@minotaur-ergo/types';
import { Inventory2Outlined } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import BackButton from '@/components/back-button/BackButton';
import SignButtonLabel from '@/components/sign-button-label/SignButtonLabel';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import TxSignContext from '@/components/sign/context/TxSignContext';
import TransactionBoxes from '@/components/sign/transaction-boxes/TransactionBoxes';
import StateMessage from '@/components/state-message/StateMessage';
import useMessage from '@/hooks/ergo-pay/useMessage';
import SvgIcon from '@/icons/SvgIcon';
import AppFrame from '@/layouts/AppFrame';
import SignTx from '@/pages/wallet-page/send/sign-tx/SignTx';

const ErgoPay = (props: QrCodeScannedComponentPropsType) => {
  const [wallet, setWallet] = useState<StateWallet | undefined>();
  const [address, setAddress] = useState('not selected');
  const [tryCount, setTryCount] = useState(0);
  const [startLoad, setStartLoad] = useState(false);
  const [displayBoxes, setDisplayBoxes] = useState(false);
  const context = useContext(TxDataContext);
  const signContext = useContext(TxSignContext);
  const [hasError, setHasError] = useState(false);
  const handleSelectWallet = (walletId: string) => {
    const filtered = wallets.filter((wallet) => `${wallet.id}` === walletId);
    if (filtered.length > 0) {
      setWallet(filtered[0]);
    }
  };
  const {
    failed,
    title,
    description,
    severity,
    selectWallet,
    wallets,
    selectAddress,
    allowMultipleAddress,
  } = useMessage(
    props.scanned,
    tryCount,
    startLoad,
    wallet,
    address === 'all'
      ? wallet?.addresses
      : wallet?.addresses.filter((item) => `${item.id}` === address),
  );
  return (
    <AppFrame
      title="Ergo pay"
      navigation={<BackButton onClick={props.close} />}
      toolbar={
        failed ? (
          <Button
            onClick={() => setTryCount(tryCount + 1)}
            color="error"
            sx={{ mx: 'auto', mt: 6 }}
          >
            Retry
          </Button>
        ) : selectAddress ? (
          <Button
            onClick={() => setStartLoad(true)}
            disabled={wallet === undefined}
          >
            Next
          </Button>
        ) : context.tx && wallet ? (
          <Button disabled={hasError} onClick={() => signContext.handle()}>
            <SignButtonLabel wallet={wallet} />
          </Button>
        ) : undefined
      }
      actions={
        context.tx ? (
          <IconButton onClick={() => setDisplayBoxes(true)}>
            <Inventory2Outlined />
          </IconButton>
        ) : undefined
      }
    >
      {title !== '' || description.length > 0 ? (
        <React.Fragment>
          <StateMessage
            title={title || ''}
            description={description}
            icon={
              severity === '' ? (
                <CircularProgress />
              ) : (
                <SvgIcon
                  icon={severity}
                  color={severity}
                  style={{ marginBottom: -8 }}
                />
              )
            }
            color={`${severity}.dark`}
            disableIconShadow={severity === ''}
          />
        </React.Fragment>
      ) : selectWallet ? (
        <React.Fragment>
          <Typography>Please Select One Wallet To Connect ErgoPay:</Typography>
          <FormControl sx={{ mt: 1 }}>
            <InputLabel id="select-wallet-label">Wallet</InputLabel>
            <Select
              labelId="select-wallet-label"
              id="select-wallet"
              value={`${wallet ? wallet.id : 'not selected'}`}
              onChange={(event) => handleSelectWallet(event.target.value)}
            >
              <MenuItem value="not selected">Select Wallet</MenuItem>
              {wallets.map((item) => (
                <MenuItem value={`${item.id}`} key={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </React.Fragment>
      ) : undefined}
      {selectAddress && wallet !== undefined ? (
        <React.Fragment>
          <Typography style={{ marginTop: 40 }}>
            Please Select One Address To Use For ErgoPay:
          </Typography>
          <FormControl sx={{ mt: 1 }}>
            <InputLabel id="select-address-label">Address</InputLabel>
            <Select
              labelId="select-wallet-label"
              id="select-wallet"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            >
              <MenuItem value="not selected">Select Address</MenuItem>
              {allowMultipleAddress ? (
                <MenuItem value="all">All Addresses</MenuItem>
              ) : undefined}
              {wallet.addresses.map((item) => (
                <MenuItem value={`${item.id}`} key={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </React.Fragment>
      ) : undefined}
      {wallet || wallets.length === 1 ? (
        <React.Fragment>
          <SignTx
            wallet={wallet ? wallet : wallets[0]}
            setHasError={setHasError}
            hideLoading={true}
          />
          <TransactionBoxes
            open={displayBoxes}
            handleClose={() => setDisplayBoxes(false)}
          />
        </React.Fragment>
      ) : null}
    </AppFrame>
  );
};

export default ErgoPay;
