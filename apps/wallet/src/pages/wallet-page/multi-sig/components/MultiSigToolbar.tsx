import { commit } from '@/action/multi-sig/commit';
import { sign } from '@/action/multi-sig/sign';
import { ContentPasteOutlined, ShareOutlined } from '@mui/icons-material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Button, Grid } from '@mui/material';
import React, { useContext } from 'react';
import { validatePassword } from '@/action/wallet';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { MultiSigDataContext } from '@/components/sign/context/MultiSigDataContext';
import { MultiSigDataShare, MultiSigStateEnum } from '@/types/multi-sig';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import { readClipBoard } from '@/utils/clipboard';
import { QrCodeContext } from '@/components/qr-code-scanner/QrCodeContext';
import { QrCodeTypeEnum } from '@/types/qrcode';
import { verifyAndSaveData } from '@/action/multi-sig/verify';
import MessageContext from '@/components/app/messageContext';
import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';

const MultiSigToolbar = () => {
  const context = useContext(MultiSigContext);
  const data = useContext(TxDataContext);
  const multiSigData = useContext(MultiSigDataContext);
  const scanContext = useContext(QrCodeContext);
  // const submitContext = useContext(TxSubmitContext);
  const message = useContext(MessageContext);
  const signer = useSignerWallet(data.wallet);
  const getLabel = () => {
    switch (multiSigData.state) {
      case MultiSigStateEnum.SIGNING:
        return 'Sign Transaction';
      case MultiSigStateEnum.COMMITMENT:
        return 'Generate Commitment';
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
        data.reduced,
        data.wallet,
        multiSigData.related,
        context.password,
        data.boxes,
        context.hints,
      ).then((res) => {
        if (res.changed) {
          context.setHints(res.hints, res.updateTime);
          multiSigData.setNeedPassword(false);
        }
        return null;
      });
    }
  };

  const signAction = () => {
    if (multiSigData.related && data.reduced) {
      sign(
        data.wallet,
        multiSigData.related,
        context.hints,
        data.reduced,
        data.boxes,
        context.password,
      ).then((res) => {
        context.setHints(res.hints, res.currentTime);
      });
    }
  };

  const processNewData = async (newContent: string) => {
    if (signer) {
      const clipBoardData = JSON.parse(newContent) as MultiSigDataShare;
      const verification = await verifyAndSaveData(
        clipBoardData as MultiSigDataShare,
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
    // if (context.data.partial) {
    //   submitContext.submit(context.data.partial);
    // } else {
    //   console.error('Unknown error occurred');
    // }
  };

  const pasteAction = async () => {
    try {
      const clipBoardContent = await readClipBoard();
      const contentJson = JSON.parse(clipBoardContent);
      if (QrCodeTypeEnum.MultiSigRequest in contentJson) {
        await processNewData(contentJson[QrCodeTypeEnum.MultiSigRequest]);
      } else {
        await processNewData(clipBoardContent);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const act = async () => {
    switch (multiSigData.state) {
      case MultiSigStateEnum.SIGNING:
        return signAction();
      case MultiSigStateEnum.COMMITMENT:
        return await commitAction();
      case MultiSigStateEnum.COMPLETED:
        return await publishAction();
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
    !validatePassword(multiSigData.related.seed, context.password);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {allowAction() ? (
          <Grid item xs={12}>
            <Button
              onClick={act}
              startIcon={
                multiSigData.state === MultiSigStateEnum.COMPLETED ? (
                  <ShareOutlined />
                ) : null
              }
              disabled={
                passwordInvalid &&
                multiSigData.state !== MultiSigStateEnum.COMPLETED
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
                startIcon={<QrCodeScannerIcon />}
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
