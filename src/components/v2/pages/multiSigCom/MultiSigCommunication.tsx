import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { Button, styled } from '@mui/material';
import ListController from '../../components/ListController';
import MultiSigTransactionItem from './MultiSigTransactionItem';
import { ContentPasteOutlined } from '@mui/icons-material';
import { MSTransactions } from '../../data';

const FloatingButton = styled(Button)(
  ({ theme }) => `
  position: absolute;
  bottom: ${theme.spacing(3)};
  right: ${theme.spacing(3)};
  min-width: 56px;
  width: 56px;
  height: 56px;
  border-radius: 56px;
  box-shadow: ${theme.shadows[2]}!important;
`
);

const MultiSigCommunication = () => {
  const get_transactions = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(MSTransactions), 300);
    });

  const handle_paste = () => {
    console.log('paste from clipboard');
  };

  return (
    <AppFrame title="Multi-sig Communication" navigation={<BackButton />}>
      <ListController
        ListItem={<MultiSigTransactionItem />}
        getData={get_transactions}
        divider={false}
        emptyTitle="There is no transaction in progress!"
        emptyDescription="You can..."
        emptyIcon="folder"
      />
      <FloatingButton onClick={handle_paste}>
        <ContentPasteOutlined />
      </FloatingButton>
    </AppFrame>
  );
};

export default MultiSigCommunication;
