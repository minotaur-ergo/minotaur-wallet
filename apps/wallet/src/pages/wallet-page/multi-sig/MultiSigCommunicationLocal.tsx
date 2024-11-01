import { fetchMultiSigBriefRow } from '@/action/multi-sig/store';
import { verifyAndSaveData } from '@/action/multi-sig/verify';
import MessageContext from '@/components/app/messageContext';
import FabStack from '@/components/fab-stack/FabStack';
import ListController from '@/components/list-controller/ListController';
import { QrCodeContext } from '@/components/qr-code-scanner/QrCodeContext';
import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';
import MultiSigTransactionItem from '@/pages/wallet-page/multi-sig/MultiSigTransactionItem';
import { getRoute, RouteMap } from '@/router/routerMap';
import { GlobalStateType } from '@/store';
import { StateWallet } from '@/store/reducer/wallet';
import { MultiSigBriefRow, MultiSigShareData } from '@/types/multi-sig';
import { QrCodeTypeEnum } from '@/types/qrcode';
import { readClipBoard } from '@/utils/clipboard';
import { LOCAL_MULTI_SIG_COMMUNICATION } from '@/utils/const';
import { ContentPasteOutlined, QrCodeScanner } from '@mui/icons-material';
import { Fab } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface MultiSigCommunicationLocalPropsType {
  wallet: StateWallet;
}

const MultiSigCommunicationLocal = (
  props: MultiSigCommunicationLocalPropsType,
) => {
  const [items, setItems] = useState<Array<MultiSigBriefRow>>([]);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false);
  const [loadedTime, setLoadedTime] = useState(0);
  const message = useContext(MessageContext);
  const navigate = useNavigate();
  const scanContext = useContext(QrCodeContext);
  const signer = useSignerWallet(props.wallet);
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
    if (signer) {
      const data = JSON.parse(content) as MultiSigShareData;
      const response = await verifyAndSaveData(data, props.wallet, signer);
      if (!response.valid) {
        message.insert(response.message, 'error');
      } else {
        if (response.txId) {
          const route = getRoute(RouteMap.WalletMultiSigTxView, {
            id: props.wallet.id,
            type: LOCAL_MULTI_SIG_COMMUNICATION,
            txId: response.txId,
          });
          navigate(route);
        }
        message.insert(response.message, 'success');
      }
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
  );
};

export default MultiSigCommunicationLocal;
