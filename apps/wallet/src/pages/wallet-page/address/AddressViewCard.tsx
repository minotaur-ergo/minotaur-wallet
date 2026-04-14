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
import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';
import AssetRow from '@/components/asset-row/AssetRow';
import BalanceDisplay from '@/components/balance-display/BalanceDisplay';
import QRCodeSVG from '@/components/display-qrcode/QrCodeSVG';
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
      <Typography fontSize="2rem" textAlign="center">
        <ErgAmountDisplay amount={BigInt(props.address.balance)} />
        <Typography component="span" color="text.secondary" ml={1}>
          ERG
        </Typography>
      </Typography>
      <Typography
        fontSize={16}
        fontWeight={400}
        color="textSecondary"
        textAlign="center"
      >
        <BalanceDisplay
          amount={BigInt(props.address.balance)}
          tokenBalances={[]}
        />
      </Typography>
      {props.address.tokens.length > 0 ? (
        <React.Fragment>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography fontSize={14} color="textSecondary" fontWeight={600}>
              Tokens
            </Typography>
            <Box
              sx={{
                ml: 1,
                px: 0.75,
                py: 0.5,
                borderRadius: '4px',
                bgcolor: '#0000000F',
              }}
            >
              <Typography fontSize={12} color="text.secondary">
                {props.address.tokens.length}
              </Typography>
            </Box>
          </Box>
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
