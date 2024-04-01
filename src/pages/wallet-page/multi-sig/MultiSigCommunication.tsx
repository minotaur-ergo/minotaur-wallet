import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  fetchMultiSigBriefRow,
  fetchMultiSigRows,
  notAvailableAddresses,
  storeMultiSigRow,
} from '@/action/multi-sig/store';
import ListController from '@/components/list-controller/ListController';
import { MultiSigBriefRow, MultiSigShareData } from '@/types/multi-sig';
import AppFrame from '@/layouts/AppFrame';
import { ContentPasteOutlined, QrCodeScanner } from '@mui/icons-material';
import { GlobalStateType } from '@/store';
import { StateWallet } from '@/store/reducer/wallet';
import MultiSigTransactionItem from './MultiSigTransactionItem';
import { readClipBoard } from '@/utils/clipboard';
import MessageContext from '@/components/app/messageContext';
import * as wasm from 'ergo-lib-wasm-browser';
import { deserialize } from '@/action/box';
import { useNavigate } from 'react-router-dom';
import { RouteMap, getRoute } from '@/router/routerMap';
import { dottedText } from '@/utils/functions';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import { Fab } from '@mui/material';
import FabStack from '@/components/fab-stack/FabStack';
import { QrCodeContext } from '@/components/qr-code-scanner/QrCodeContext';
import { QrCodeTypeEnum } from '@/types/qrcode';

interface MultiSigCommunicationPropsType {
  wallet: StateWallet;
}

const MultiSigCommunication = (props: MultiSigCommunicationPropsType) => {
  const [items, setItems] = useState<Array<MultiSigBriefRow>>([]);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false);
  const [loadedTime, setLoadedTime] = useState(0);
  const message = useContext(MessageContext);
  const navigate = useNavigate();
  const scanContext = useContext(QrCodeContext);
  const lastChanged = useSelector(
    (state: GlobalStateType) => state.config.multiSigLoadedTime,
  );
  useEffect(() => {
    if (!loading && loadedTime !== lastChanged) {
      const startUpdating = lastChanged;
      setLoading(true);
      fetchMultiSigBriefRow(props.wallet).then((res) => {
        setItems(res);
        setLoadedTime(startUpdating);
        setLoading(false);
      });
    }
  }, [loading, loadedTime, lastChanged, props.wallet]);

  const processNewData = async (content: string) => {
    const data = JSON.parse(content) as MultiSigShareData;
    const tx = wasm.ReducedTransaction.sigma_parse_bytes(
      Buffer.from(data.tx, 'base64'),
    );
    const boxes = data.boxes.map(deserialize);
    const invalidAddresses = notAvailableAddresses(
      props.wallet,
      data.commitments,
      tx.unsigned_tx(),
      boxes,
    );
    if (invalidAddresses.length === 0) {
      const oldRow = await fetchMultiSigRows(props.wallet, [
        tx.unsigned_tx().id().to_str(),
      ]);
      const secrets = oldRow.length > 0 ? oldRow[0].secrets : [[]];
      const row = await storeMultiSigRow(
        props.wallet,
        tx,
        boxes,
        data.commitments,
        secrets,
        data.signed || [],
        data.simulated || [],
        Date.now(),
        data.partial
          ? wasm.Transaction.sigma_parse_bytes(
              Buffer.from(data.partial, 'base64'),
            )
          : undefined,
      );
      if (row) {
        const route = getRoute(RouteMap.WalletMultiSigTxView, {
          id: props.wallet.id,
          txId: row.txId,
        });
        navigate(route);
      }
    } else {
      const messageLines = [
        'Some addresses used in transaction are not derived.',
        'Please derive them and try again',
        'Not derived addresses are:',
        ...invalidAddresses.map((item) => dottedText(item, 10)),
      ];
      message.insert(messageLines.join('\n'), 'error');
    }
  };

  const readingQrCode = () => {
    scanContext
      .start()
      .then(processNewData)
      .catch((reason: string) => console.log('scanning failed ', reason));
  };

  const handlePasteNewTransaction = async () => {
    setReading(true);
    try {
      const clipBoardContent = await readClipBoard();
      const contentJson = JSON.parse(clipBoardContent);
      if (QrCodeTypeEnum.MultiSigRequest in contentJson) {
        await processNewData(contentJson[QrCodeTypeEnum.MultiSigRequest]);
      } else {
        await processNewData(clipBoardContent);
      }
    } catch (e: unknown) {
      message.insert(`${(e as { message: unknown }).message}`, 'error');
    }
    setReading(false);
  };
  return (
    <AppFrame title="Multi-sig Communication" navigation={<BackButtonRouter />}>
      <React.Fragment>
        <ListController
          loading={loading}
          error={false}
          errorDescription={''}
          errorTitle={''}
          data={items}
          render={(row) => (
            <MultiSigTransactionItem
              wallet={props.wallet}
              txId={row.txId}
              ergIn={row.ergIn}
              ergOut={row.ergOut}
              signs={row.signed}
              commitments={row.committed}
              tokensIn={row.tokensIn}
              tokensOut={row.tokensOut}
            />
          )}
          divider={false}
          emptyTitle="There is no transaction in progress!"
          emptyDescription="You can add transaction using botton below to start signing process"
          emptyIcon="folder"
        />
        <FabStack direction="row-reverse" spacing={2}>
          <Fab disabled={reading} onClick={readingQrCode} color="primary">
            <QrCodeScanner />
          </Fab>
          <Fab
            disabled={reading}
            onClick={handlePasteNewTransaction}
            color="primary"
          >
            <ContentPasteOutlined />
          </Fab>
        </FabStack>
      </React.Fragment>
    </AppFrame>
  );
};

export default MultiSigCommunication;
