import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  MultiSigBriefRow,
  MultiSigDataShare,
  QrCodeTypeEnum,
  StateWallet,
} from '@minotaur-ergo/types';
import { GlobalStateType } from '@minotaur-ergo/types';
import { Tab, Tabs } from '@mui/material';

import { fetchMultiSigBriefRow } from '@/action/multi-sig/store';
import { verifyAndSaveData } from '@/action/multi-sig/verify';
import MessageContext from '@/components/app/messageContext';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import { QrCodeContext } from '@/components/qr-code-scanner/QrCodeContext';
import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';
import AppFrame from '@/layouts/AppFrame';
import { getRoute, RouteMap } from '@/router/routerMap';
import { readClipBoard } from '@/utils/clipboard';

import MultiSigCommunicationManualTab from './MultiSigCommunicationManualTab';
import MultiSigCommunicationServerTab from './MultiSigCommunicationServerTab';

interface MultiSigCommunicationPropsType {
  wallet: StateWallet;
}

const MANUAL_TAB = 'manual';
const SERVER_TAB = 'server';

const MultiSigCommunication = (props: MultiSigCommunicationPropsType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Array<MultiSigBriefRow>>([]);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false);
  const [loadedTime, setLoadedTime] = useState(0);
  const [tab, setTab] = useState<string>(
    searchParams.get('tab') === SERVER_TAB ? SERVER_TAB : MANUAL_TAB,
  );
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

  const processDataJson = async (data: MultiSigDataShare) => {
    if (signer) {
      const response = await verifyAndSaveData(data, props.wallet, signer);
      if (!response.valid) {
        message.insert(response.message, 'error');
      } else {
        if (response.txId) {
          const route = getRoute(RouteMap.WalletMultiSigTxView, {
            id: props.wallet.id,
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

  const processNewData = async (content: string) => {
    const contentJson = JSON.parse(content);
    if (QrCodeTypeEnum.MultiSigRequest in contentJson) {
      await processDataJson(
        JSON.parse(
          contentJson[QrCodeTypeEnum.MultiSigRequest],
        ) as MultiSigDataShare,
      );
    } else {
      await processDataJson(contentJson as MultiSigDataShare);
    }
  };

  const handlePasteNewTransaction = async () => {
    setReading(true);
    try {
      const clipBoardContent = await readClipBoard();
      await processNewData(clipBoardContent);
    } catch (e: unknown) {
      message.insert(`${(e as { message: unknown }).message}`, 'error');
    }
    setReading(false);
  };

  const handleTabChange = (value: string) => {
    setTab(value);
    setSearchParams(
      (params) => {
        if (value === SERVER_TAB) {
          params.set('tab', SERVER_TAB);
        } else {
          params.delete('tab');
        }
        return params;
      },
      { replace: true },
    );
  };

  return (
    <AppFrame title="Multi-sig Communication" navigation={<BackButtonRouter />}>
      <React.Fragment>
        <Tabs
          value={tab}
          onChange={(_, value) => handleTabChange(value)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            'minHeight': 40,
            'mb': 2,
            'borderBottom': '1px solid',
            'borderColor': 'divider',
            '& .MuiTab-root': {
              flex: 1,
              minHeight: 40,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: 15,
              lineHeight: '16px',
              letterSpacing: '0.16px',
            },
          }}
          TabIndicatorProps={{
            sx: {
              height: 2,
              borderRadius: 2,
              bottom: 0,
            },
          }}
        >
          <Tab value={MANUAL_TAB} label="Manual" />
          <Tab value={SERVER_TAB} label="Server" />
        </Tabs>

        {tab === MANUAL_TAB ? (
          <MultiSigCommunicationManualTab
            wallet={props.wallet}
            items={items}
            loading={loading}
            reading={reading}
            onReadQrCode={readingQrCode}
            onPasteNewTransaction={handlePasteNewTransaction}
          />
        ) : (
          <MultiSigCommunicationServerTab wallet={props.wallet} />
        )}
      </React.Fragment>
    </AppFrame>
  );
};

export default MultiSigCommunication;
