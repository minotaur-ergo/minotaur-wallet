import React from 'react';
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import Restore from '@mui/icons-material/RestorePage';
import {
  faCoffee,
  faPlus,
  faGroupArrowsRotate,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WalletCreateType } from './walletCreateType';

interface PropsType {
  setWalletType: (walletType: WalletCreateType) => unknown;
}

const WalletInsertOption = (props: PropsType) => {
  return (
    <List style={{ marginTop: '100px' }}>
      <ListItem onClick={() => props.setWalletType(WalletCreateType.New)}>
        <ListItemAvatar>
          <Avatar>
            <FontAwesomeIcon icon={faPlus} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="New wallet"
          secondary="Generate a random mnemonic and create a wallet with it. It can be a cold wallet or a normal wallet"
        />
      </ListItem>
      <Divider />
      <ListItem onClick={() => props.setWalletType(WalletCreateType.Restore)}>
        <ListItemAvatar>
          <Avatar>
            <Restore />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Restore wallet"
          secondary="Restore a wallet from an existing mnemonic. It can be a cold wallet or a normal wallet"
        />
      </ListItem>
      <Divider />
      <ListItem onClick={() => props.setWalletType(WalletCreateType.ReadOnly)}>
        <ListItemAvatar>
          <Avatar>
            <FontAwesomeIcon icon={faCoffee} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Add read only wallet"
          secondary="Create a read-only wallet without storing any secret to track and create your transactions. It cannot sign any transaction and you need the corresponding cold wallet for signing."
        />
      </ListItem>
      <Divider />
      <ListItem onClick={() => props.setWalletType(WalletCreateType.MultiSig)}>
        <ListItemAvatar>
          <Avatar>
            <FontAwesomeIcon icon={faGroupArrowsRotate} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Add multi sig wallet"
          secondary="New Multi-Signature Wallet Create a multi-signature wallet and manage your co-signing wallets."
        />
      </ListItem>
    </List>
  );
};

export default WalletInsertOption;
