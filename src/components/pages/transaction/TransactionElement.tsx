import React from 'react';
import WalletTx from '../../../db/entities/views/WalletTx';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import DisplayId from '../../display-id/DisplayId';
import Erg from '../../value/Erg';

interface PropsType {
  transaction: WalletTx;
  handleClick: () => unknown;
}

const TransactionElement = (props: PropsType) => {
  const openTx = () => props.handleClick();
  const total_erg_in = props.transaction.create_erg();
  const total_erg_out = props.transaction.spent_erg();
  const type = total_erg_in > total_erg_out ? 'in' : 'out';
  const tx_erg =
    type === 'in' ? total_erg_in - total_erg_out : total_erg_out - total_erg_in;
  return (
    <ListItem onClick={openTx}>
      <ListItemAvatar>
        <Avatar>
          {type === 'in' ? <AddCircleOutline /> : <RemoveCircleOutline />}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<DisplayId id={props.transaction.tx_id} />}
        secondary={
          <React.Fragment>
            {/*<DateView timestamp={props.transaction.date} showTime={true} />*/}
            <Erg
              erg={tx_erg}
              showUnit={true}
              network_type={props.transaction.network_type}
            />
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

export default TransactionElement;
