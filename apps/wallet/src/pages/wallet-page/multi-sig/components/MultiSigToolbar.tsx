import React, { useContext, useState } from 'react';

import {
  MultiSigDataShare,
  MultiSigStateEnum,
  QrCodeTypeEnum,
} from '@minotaur-ergo/types';
import {
  ContentPasteOutlined,
  QrCodeScanner,
  ShareOutlined,
} from '@mui/icons-material';
import { Button, CircularProgress, Grid } from '@mui/material';

import { commit } from '@/action/multi-sig/commit';
import { sign } from '@/action/multi-sig/sign';
import { verifyAndSaveData } from '@/action/multi-sig/verify';
import { validatePassword } from '@/action/wallet';
import MessageContext from '@/components/app/messageContext';
import { QrCodeContext } from '@/components/qr-code-scanner/QrCodeContext';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { MultiSigDataContext } from '@/components/sign/context/MultiSigDataContext';
import { MultiSigPasswordContext } from '@/components/sign/context/MultiSigPasswordContext';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import TxSubmitContext from '@/components/sign/context/TxSubmitContext';
import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';
import { readClipBoard } from '@/utils/clipboard';

const MultiSigToolbar = () => {
  const context = useContext(MultiSigContext);
  const { password } = useContext(MultiSigPasswordContext);
  const data = useContext(TxDataContext);
  const multiSigData = useContext(MultiSigDataContext);
  const scanContext = useContext(QrCodeContext);
  const submitContext = useContext(TxSubmitContext);
  const message = useContext(MessageContext);
  const signer = useSignerWallet(data.wallet);
  const [processing, setProcessing] = useState(false);
  const getLabel = () => {
    switch (multiSigData.state) {
      case MultiSigStateEnum.SIGNING:
        return processing ? 'Signing Transaction' : 'Sign Transaction';
      case MultiSigStateEnum.COMMITMENT:
        return processing ? 'Generating Commitment' : 'Generate Commitment';
      case MultiSigStateEnum.COMPLETED:
        return 'Publish Transaction';
    }
  };

  const commitAction = () => {
    if (
      data.reduced &&
      multiSigData.related &&
      !multiSigData.myAction.committed
    ) {
      return commit(
        context.rowId,
        data.reduced,
        data.wallet,
        multiSigData.related,
        password,
        context.hints,
      )
        .then((res) => {
          if (res.changed) {
            context.setHints(res.hints, res.updateTime);
            multiSigData.setNeedPassword(false);
          }
          return null;
        })
        .catch((e) => {
          console.error(e);
          message.insert('Failed to generate commitment', 'error');
        });
    }
  };

  const signAction = () => {
    if (multiSigData.related && data.reduced) {
      return sign(
        context.rowId,
        data.wallet,
        multiSigData.related,
        context.hints,
        data.reduced,
        data.boxes,
        password,
      )
        .then((res) => {
          context.setHints(res.hints, res.currentTime);
        })
        .catch((e) => {
          console.error(e);
          message.insert('Failed to sign transaction', 'error');
        });
    }
  };

  const processNewData = async (newContent: string) => {
    if (signer) {
      const arrivedData = JSON.parse(newContent);
      const processData =
        QrCodeTypeEnum.MultiSigRequest in arrivedData
          ? JSON.parse(arrivedData[QrCodeTypeEnum.MultiSigRequest])
          : arrivedData;
      const verification = await verifyAndSaveData(
        processData as MultiSigDataShare,
        data.wallet,
        signer,
        data.tx?.id().to_str(),
      );
      message.insert(
        verification.message,
        verification.valid ? 'success' : 'error',
      );
    }
  };

  const publishAction = async () => {
    if (context.signed) {
      await submitContext.submit(context.signed);
    } else {
      console.error('Unknown error occurred');
    }
  };

  const pasteAction = async () => {
    try {
      await processNewData(await readClipBoard());
    } catch (e) {
      console.log(e);
    }
  };

  const act = async () => {
    switch (multiSigData.state) {
      case MultiSigStateEnum.SIGNING:
        return await signAction();
      case MultiSigStateEnum.COMMITMENT:
        return await commitAction();
      case MultiSigStateEnum.COMPLETED:
        return await publishAction();
    }
  };

  const handleAct = async () => {
    if (processing) return;
    setProcessing(true);
    try {
      // commit and sign run long synchronous wasm code on large transactions.
      // let the browser paint the processing state before the main thread blocks.
      await new Promise((resolve) => setTimeout(resolve, 50));
      await act();
    } finally {
      setProcessing(false);
    }
  };

  const startScanner = () => {
    scanContext
      .start()
      .then(processNewData)
      .catch((reason: string) => console.log('scanning failed ', reason));
  };

  const allowAction = () => {
    switch (multiSigData.state) {
      case MultiSigStateEnum.COMPLETED:
        return true;
      case MultiSigStateEnum.SIGNING:
        return !multiSigData.myAction.signed;
      case MultiSigStateEnum.COMMITMENT:
        return !multiSigData.myAction.committed;
    }
  };

  const needModeData = () => {
    switch (multiSigData.state) {
      case MultiSigStateEnum.COMMITMENT:
        return true;
      case MultiSigStateEnum.SIGNING:
        return !multiSigData.myAction.signed;
      case MultiSigStateEnum.COMPLETED:
        return false;
    }
  };

  const passwordInvalid =
    multiSigData.related !== undefined &&
    !validatePassword(multiSigData.related.seed, password);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {allowAction() ? (
          <Grid item xs={12}>
            <Button
              onClick={handleAct}
              startIcon={
                processing ? (
                  <CircularProgress size={20} color="inherit" />
                ) : multiSigData.state === MultiSigStateEnum.COMPLETED ? (
                  <ShareOutlined />
                ) : null
              }
              disabled={
                processing ||
                (passwordInvalid &&
                  multiSigData.state !== MultiSigStateEnum.COMPLETED)
              }
            >
              {getLabel()}
            </Button>
          </Grid>
        ) : null}
        {needModeData() ? (
          <React.Fragment>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                onClick={pasteAction}
                startIcon={<ContentPasteOutlined />}
              >
                Paste
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                onClick={startScanner}
                startIcon={<QrCodeScanner />}
              >
                Scan QrCode
              </Button>
            </Grid>
          </React.Fragment>
        ) : null}
      </Grid>
    </React.Fragment>
  );
};

export default MultiSigToolbar;
