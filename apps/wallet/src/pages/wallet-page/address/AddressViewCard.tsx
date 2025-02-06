import { WalletDbAction } from '@/action/db';
import AddressCopyable from '@/components/address-copyable/AddressCopyable';
import AssetRow from '@/components/asset-row/AssetRow';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import React from 'react';
import { Box, Button, Divider, IconButton, Typography } from '@mui/material';
import QRCodeSVG from '@/components/display-qrcode/QrCodeSVG';
import Heading from '@/components/heading/Heading';
import ListController from '@/components/list-controller/ListController';
import { StateAddress, TokenInfo } from '@/store/reducer/wallet';
import { ChainTypeInterface } from '@/utils/networks/interfaces';

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
  return (
    <React.Fragment>
      <Box display="flex" mb={2}>
        <IconButton onClick={props.handleEdit}>
          <EditOutlinedIcon />
        </IconButton>
        <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
          {props.name}
        </Typography>
        <IconButton onClick={props.handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      {props.address.tokens.length > 0 ? (
        <React.Fragment>
          <Heading title="Tokens" />
          <ListController
            loading={false}
            error={false}
            data={props.address.tokens}
            divider={false}
            emptyTitle={''}
            render={(item: TokenInfo) => (
              <AssetRow
                id={item.tokenId}
                networkType={props.chain.label}
                amount={item.balance}
              />
            )}
          />
        </React.Fragment>
      ) : undefined}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ p: 8, textAlign: 'center', fontStyle: 'italic' }}>
        <QRCodeSVG value={props.address.address} />
      </Box>
      <AddressCopyable address={props.address.address} />
      <Typography
        sx={{ my: 2, overflowWrap: 'anywhere', textAlign: 'center' }}
        variant="body2"
        color="textSecondary"
      >
        Derivation path: {"m/44'/429'/0'/00/"}
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
