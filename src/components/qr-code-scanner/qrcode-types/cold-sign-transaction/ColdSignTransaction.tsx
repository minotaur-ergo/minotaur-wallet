import BackButton from '@/components/back-button/BackButton';
import AppFrame from '@/layouts/AppFrame';
import { Inventory2Outlined } from '@mui/icons-material';
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import * as wasm from 'ergo-lib-wasm-browser';
import CenterMessage from '@/components/state-message/CenterMessage';
import SvgIcon from '@/icons/SvgIcon';
import TxSignValues from '@/pages/wallet-page/send/sign-tx/TxSignValues';
import Loading from '@/components/state-message/Loading';
import TransactionBoxes from '@/components/sign/transaction-boxes/TransactionBoxes';
import useBoxes from '@/hooks/useBoxes';
import { StateWallet } from '@/store/reducer/wallet';
import TxSubmitContext from '@/components/sign/context/TxSubmitContext';
import { SelectableWalletContext } from '@/components/sign/context/SelectableWalletContext';

interface ColdSignTransactionPropsType {
  scanned: string;
  close: () => unknown;
}

const ColdSignTransaction = (props: ColdSignTransactionPropsType) => {
  const [displayBoxes, setDisplayBoxes] = useState(false);
  const [tx, setTx] = useState<wasm.Transaction | undefined>();
  const [wallet, setWallet] = useState<StateWallet | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stored, setStored] = useState('');
  const boxes = useBoxes(tx, wallet);
  const context = useContext(TxSubmitContext);
  const walletContext = useContext(SelectableWalletContext);
  const usedWallet = boxes.wallets.length === 1 ? boxes.wallets[0] : wallet;
  useEffect(() => {
    if (
      usedWallet &&
      walletContext.wallet &&
      walletContext.wallet.id !== usedWallet.id
    ) {
      walletContext.setWallet(usedWallet);
    }
  });

  useEffect(() => {
    if (!loading) {
      if (stored !== props.scanned) {
        setLoading(true);
        try {
          const scannedJson = JSON.parse(props.scanned);
          const newTx = wasm.Transaction.sigma_parse_bytes(
            Buffer.from(scannedJson.signedTx, 'base64'),
          );
          if (tx?.id().to_str() !== newTx.id().to_str()) {
            setTx(newTx);
          }
          setStored(props.scanned);
        } catch (e) {
          console.log(e);
          setError('Invalid Data Scanned');
        }
        setLoading(false);
      }
    }
  }, [loading, stored, props.scanned, tx]);

  const handleSelectWallet = (walletId: string) => {
    const filtered = boxes.wallets.filter(
      (wallet) => `${wallet.id}` === walletId,
    );
    if (filtered.length > 0) {
      setWallet(filtered[0]);
    }
  };

  const submit = () => {
    if (tx) {
      context.submit(tx);
    }
  };

  return (
    <AppFrame
      title="Cold Signing Transaction"
      navigation={<BackButton onClick={props.close} />}
      actions={
        tx && !(boxes.error || error) ? (
          <IconButton onClick={() => setDisplayBoxes(true)}>
            <Inventory2Outlined />
          </IconButton>
        ) : undefined
      }
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

export default ColdSignTransaction;
