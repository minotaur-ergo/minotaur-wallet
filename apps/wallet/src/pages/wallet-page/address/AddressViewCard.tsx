import React, { useState } from 'react';

import {
  ChainTypeInterface,
  StateAddress,
  TokenBalance,
} from '@minotaur-ergo/types';
import {
  Close,
  EditOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { Box, Button, Divider, IconButton, Typography } from '@mui/material';

import { WalletDbAction } from '@/action/db';
import AddressCopyable from '@/components/address-copyable/AddressCopyable';
import AssetRow from '@/components/asset-row/AssetRow';
import QRCodeSVG from '@/components/display-qrcode/QrCodeSVG';
import Heading from '@/components/heading/Heading';
import ListController from '@/components/list-controller/ListController';

interface AddressViewCardPropsType {
  address: StateAddress;
  chain: ChainTypeInterface;
  isDefault: boolean;
  name: string;
  handleEdit: () => unknown;
  handleClose: () => unknown;
}

const AddressViewCard = (props: AddressViewCardPropsType) => {
  const setDefaultAddress = () => {
    WalletDbAction.getInstance()
      .setDefaultAddress(props.address.walletId, props.address.idx)
      .then(() => null);
  };
  const [showMore, setShowMore] = useState(false);
  const tokens = showMore
    ? props.address.tokens
    : props.address.tokens.slice(0, 3);
  return (
    <React.Fragment>
      <Box display="flex" mb={2}>
        <IconButton onClick={props.handleEdit}>
          <EditOutlined />
        </IconButton>
        <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
          {props.name}
        </Typography>
        <IconButton onClick={props.handleClose}>
          <Close />
        </IconButton>
      </Box>
      {props.address.tokens.length > 0 ? (
        <React.Fragment>
          <Heading title="Tokens" />
          <ListController
            loading={false}
            error={false}
            data={tokens}
            divider={false}
            emptyTitle={''}
            render={(item: TokenBalance) => (
              <AssetRow
                id={item.tokenId}
                networkType={props.chain.label}
                amount={item.balance}
              />
            )}
          />
        </React.Fragment>
      ) : undefined}
      &nbsp;
      {props.address.tokens.length > 3 ? (
        <Button variant="outlined" onClick={() => setShowMore(!showMore)}>
          {showMore ? (
            <React.Fragment>
              <KeyboardArrowUp />
              Show less
            </React.Fragment>
          ) : (
            <React.Fragment>
              <KeyboardArrowDown />
              Show more
            </React.Fragment>
          )}
        </Button>
      ) : (
        <Divider sx={{ my: 2 }} />
      )}
      <Box sx={{ pl: 8, pr: 8, textAlign: 'center', fontStyle: 'italic' }}>
        <QRCodeSVG value={props.address.address} />
      </Box>
      <AddressCopyable address={props.address.address} />
      <Typography
        sx={{ my: 2, overflowWrap: 'anywhere', textAlign: 'center' }}
        variant="body2"
        color="textSecondary"
      >
        Derivation path: {props.address.path}
      </Typography>
      {!props.isDefault && (
        <Button variant="text" onClick={() => setDefaultAddress()}>
          Set as default
        </Button>
      )}
    </React.Fragment>
  );
};

export default AddressViewCard;
