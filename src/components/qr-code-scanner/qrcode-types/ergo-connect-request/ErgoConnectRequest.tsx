import BackButton from '@/components/back-button/BackButton';
import AppFrame from '@/layouts/AppFrame';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import CenterMessage from '@/components/state-message/CenterMessage';
import SvgIcon from '@/icons/SvgIcon';
import TxSignValues from '@/pages/wallet-page/send/sign-tx/TxSignValues';
import Loading from '@/components/state-message/Loading';
import TransactionBoxes from '@/components/sign/transaction-boxes/TransactionBoxes';
import { StateWallet } from '@/store/reducer/wallet';

interface ColdSignTransactionPropsType {
  scanned: string;
  close: () => unknown;
}

const ErgoConnectRequest = (props: ColdSignTransactionPropsType) => {
  const [wallet, setWallet] = useState<StateWallet | undefined>();
  return (
    <AppFrame
      title="Cold Signing Transaction"
      navigation={<BackButton onClick={props.close} />}
      toolbar={
        tx && !(boxes.error || error) ? (
          <Button disabled={tx == undefined} onClick={submit}>
            Publish
          </Button>
        ) : undefined
      }
    >
      {wallet && boxes.wallets.length > 1 ? (
        <React.Fragment>
          <Typography>
            Please Select One Wallet To Extract Transaction:
          </Typography>
          <FormControl sx={{ mt: 1 }}>
            <InputLabel id="select-wallet-label">Wallet</InputLabel>
            <Select
              labelId="select-wallet-label"
              id="select-wallet"
              value={`${wallet ? wallet.id : 'not selected'}`}
              onChange={(event) => handleSelectWallet(event.target.value)}
            >
              <MenuItem value="not selected">Select Wallet</MenuItem>
              {boxes.wallets.map((item) => (
                <MenuItem value={`${item.id}`} key={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </React.Fragment>
      ) : undefined}
      {boxes.error || error ? (
        <CenterMessage
          icon={
            <SvgIcon
              icon="warning"
              color="error"
              style={{ marginBottom: -8 }}
            />
          }
          color="error.dark"
          description={[boxes.error, error]}
        />
      ) : tx && boxes && usedWallet ? (
        <React.Fragment>
          <TxSignValues tx={tx} boxes={boxes.boxes} wallet={usedWallet} />
          <TransactionBoxes
            open={displayBoxes}
            handleClose={() => setDisplayBoxes(false)}
            boxes={boxes.boxes}
            wallet={usedWallet}
            signed={tx}
          />
        </React.Fragment>
      ) : (
        <Loading description={['Loading transaction details']} />
      )}
    </AppFrame>
  );
};

export default ErgoConnectRequest;
