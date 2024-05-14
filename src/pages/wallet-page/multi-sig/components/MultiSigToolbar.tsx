import { ContentPasteOutlined, ShareOutlined } from '@mui/icons-material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Button, Grid } from '@mui/material';
import React, { useContext } from 'react';
import { validatePassword } from '@/action/wallet';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { MultiSigDataContext } from '@/components/sign/context/MultiSigDataContext';
import { MultiSigShareData, MultiSigStateEnum } from '@/types/multi-sig';
import { commit, sign } from '@/action/multi-sig/signing';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import { readClipBoard } from '@/utils/clipboard';
import * as wasm from 'ergo-lib-wasm-browser';
import { updateMultiSigRow } from '@/action/multi-sig/store';
import { QrCodeContext } from '@/components/qr-code-scanner/QrCodeContext';
import TxSubmitContext from '@/components/sign/context/TxSubmitContext';
import { QrCodeTypeEnum } from '@/types/qrcode';
import { verifyMyCommitments, verifyTxInputs } from '@/action/multi-sig/verify';
import MessageContext from '@/components/app/messageContext';
import { deserialize } from '@/action/box';

const MultiSigToolbar = () => {
  const context = useContext(MultiSigContext);
  const data = useContext(TxDataContext);
  const multiSigData = useContext(MultiSigDataContext);
  const scanContext = useContext(QrCodeContext);
  const submitContext = useContext(TxSubmitContext);
  const message = useContext(MessageContext);

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
      multiSigData.myAction.committed === false
    ) {
      return commit(
        data.reduced,
        data.wallet,
        multiSigData.related,
        context.password,
        data.boxes,
        context.data,
      ).then((res) => {
        if (res.changed) {
          context.setData(
            {
              commitments: res.commitments,
              secrets: res.secrets,
              signed: context.data.signed,
              simulated: context.data.simulated,
              partial: context.data.partial,
            },
            res.updateTime,
          );
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
        context.data.simulated,
        context.data.commitments,
        context.data.secrets,
        multiSigData.committed,
        multiSigData.signed,
        multiSigData.addresses,
        data.reduced,
        data.boxes,
        context.password,
        context.data.partial,
      ).then((res) => {
        context.setData(
          {
            commitments: context.data.commitments,
            secrets: context.data.secrets,
            signed: res.signed,
            simulated: res.simulated,
            partial: res.partial,
          },
          res.currentTime,
        );
      });
    }
  };

  const processNewData = async (newContent: string) => {
    const clipBoardData = JSON.parse(newContent) as MultiSigShareData;
    const tx = wasm.ReducedTransaction.sigma_parse_bytes(
      Buffer.from(clipBoardData.tx, 'base64'),
    );
    if (tx.unsigned_tx().id().to_str() !== data.tx?.id().to_str()) {
      message.insert('Invalid transaction', "error");
      return
    }
    if(verifyMyCommitments(clipBoardData.commitments, context.data.commitments, [[]], [])){
      message.insert('Your commitment changed.\nThis transaction can not sign anymore.\nPlease try sign it again from beginning', 'error');
      return
    }
    if(!verifyTxInputs(tx, clipBoardData.boxes.map(deserialize))){
      message.insert('Transaction inputs are invalid', 'error');
      return
    }
    await updateMultiSigRow(
      context.rowId,
      clipBoardData.commitments,
      context.data.secrets,
      clipBoardData.signed || [],
      clipBoardData.simulated || [],
      Date.now(),
      clipBoardData.partial
        ? wasm.Transaction.sigma_parse_bytes(
            Buffer.from(clipBoardData.partial, 'base64'),
          )
        : undefined,
    );
  };

  const publishAction = async () => {
    if (context.data.partial) {
      submitContext.submit(context.data.partial);
    } else {
      console.error('Unknown error occurred');
    }
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
