import React from 'react';
import { Box, Card, Divider, IconButton, Typography } from '@mui/material';
import { Close, EditOutlined } from '@mui/icons-material';
import QRCodeSVG from '@/components/display-qrcode/QrCodeSVG';
import CopyToClipboardIcon from '@/components/copy-to-clipboard/CopyToClipboardIcon';
import Heading from '@/components/heading/Heading';
import ListController from '@/components/list-controller/ListController';
import { StateAddress } from '@/store/reducer/wallet';
import { ChainTypeInterface } from '@/utils/networks/interfaces';
import AddressToken from './AddressToken';

interface AddressViewCardPropsType {
  address: StateAddress;
  chain: ChainTypeInterface;
  handleEdit: () => unknown;
  handleClose: () => unknown;
}

const AddressViewCard = (props: AddressViewCardPropsType) => {
  return (
    <React.Fragment>
      <Box display="flex" mb={2}>
        <IconButton onClick={props.handleEdit}>
          <EditOutlined />
        </IconButton>
        <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
          {props.address.name}
        </Typography>
        <IconButton onClick={props.handleClose}>
          <Close />
        </IconButton>
      </Box>
      {props.address.tokens.length > 0 ? (
        <React.Fragment>
          <Heading title="Tokens" />
          <ListController
            error={false}
            data={props.address.tokens}
            loading={false}
            render={(item, index) => (
              <AddressToken
                id={item.tokenId}
                amount={BigInt(item.balance)}
                key={index}
                network_type={props.chain.label}
              />
            )}
            emptyTitle={''}
            emptyDescription={''}
            emptyIcon={''}
            errorDescription={''}
            errorTitle={''}
          />
          <Divider sx={{my: 2}}/>
        </React.Fragment>
      ) : null}
        <Typography sx={{ p: 4, fontStyle: 'italic', color: 'textSecondary' }}>
          <QRCodeSVG value={props.address.address} />
        </Typography>
      <Box>
        <Card sx={{ display: 'flex', bgcolor: 'info.light', p: 2 }}>
          <Typography sx={{ overflowWrap: 'anywhere' }}>
            {props.address.address}
          </Typography>
          <CopyToClipboardIcon text={props.address.address} />
        </Card>
      </Box>
      {props.address.path ? (
        <Typography
          sx={{ my: 2, overflowWrap: 'anywhere', textAlign: 'center' }}
          variant="body2"
          color="textSecondary"
        >
          Derivation path: {props.address.path}
        </Typography>
      ) : null}
    </React.Fragment>
  );
};

export default AddressViewCard;
