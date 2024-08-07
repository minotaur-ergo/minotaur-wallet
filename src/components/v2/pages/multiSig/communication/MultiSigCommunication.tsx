import React, { useMemo, useState } from 'react';
import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';
import { Alert, AlertTitle, Box, Button, Tab, Tabs } from '@mui/material';
import ListController from '../../../components/ListController';
import MultiSigTransactionItem from './MultiSigTransactionItem';
import { ChevronRight, ContentPasteOutlined } from '@mui/icons-material';
import { MSTransactions, REGISTRATION } from '../../../data';
import FloatingButton from '../../../components/FloatingButton';
import { useNavigate } from 'react-router-dom';
import { RouterMap } from '../../../V2Demo';
import { RegistrationType } from '../../../models';

type TabValueType = 'MANUAL' | 'SERVER';

const ServerPanel = () => {
  const navigate = useNavigate();
  const [registrationState] = useState<RegistrationType>(REGISTRATION);
  const registerCount = useMemo(
    () => registrationState.signers.filter((i) => i.signed).length,
    [registrationState]
  );

  const getTransactions = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(MSTransactions), 100);
    });

  switch (registrationState.status) {
    case 'REGISTERED':
      return (
        <>
          <Button
            variant="outlined"
            endIcon={<ChevronRight />}
            onClick={() => navigate(RouterMap.MultiSigReg)}
            sx={{ mb: 2 }}
          >
            View Registration
          </Button>
          <ListController
            ListItem={<MultiSigTransactionItem />}
            getData={getTransactions}
            divider={false}
            emptyTitle="There is no transaction in progress!"
            emptyDescription="You can..."
            emptyIcon="folder"
          />
        </>
      );
    case 'WAITING':
      return (
        <>
          <Alert severity="warning" icon={false} sx={{ mb: 2 }}>
            <AlertTitle>
              {registrationState.requiredSignatures - registerCount} more
              registers!
            </AlertTitle>
            {registerCount} of {registrationState.requiredSignatures} required
            signers are registered.
          </Alert>
          <Button
            variant="outlined"
            endIcon={<ChevronRight />}
            onClick={() => navigate(RouterMap.MultiSigReg)}
          >
            View Registration
          </Button>
        </>
      );
    case 'NONE':
    default:
      return (
        <Button
          variant="outlined"
          endIcon={<ChevronRight />}
          onClick={() => navigate(RouterMap.MultiSigReg)}
        >
          Register
        </Button>
      );
  }
};

const MultiSigCommunication = () => {
  const [tab, setTab] = useState<TabValueType>('MANUAL');

  const getTransactions = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(MSTransactions), 300);
    });

  const handleChangeTab = (
    event: React.SyntheticEvent,
    newValue: TabValueType
  ) => {
    setTab(newValue);
  };
  const handle_paste = () => {
    console.log('paste from clipboard');
  };

  return (
    <AppFrame title="Multi-sig Communication" navigation={<BackButton />}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={handleChangeTab} variant="fullWidth">
          <Tab label="Manual" value="MANUAL" />
          <Tab label="Server" value="SERVER" />
        </Tabs>
      </Box>
      {tab === 'MANUAL' && (
        <>
          <ListController
            ListItem={<MultiSigTransactionItem />}
            getData={getTransactions}
            divider={false}
            emptyTitle="There is no transaction in progress!"
            emptyDescription="You can..."
            emptyIcon="folder"
          />
          <FloatingButton onClick={handle_paste}>
            <ContentPasteOutlined />
          </FloatingButton>
        </>
      )}
      {tab === 'SERVER' && <ServerPanel />}
    </AppFrame>
  );
};

export default MultiSigCommunication;
