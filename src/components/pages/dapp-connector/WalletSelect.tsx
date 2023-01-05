import React from 'react';
import { GlobalStateType } from '../../../store/reducer';
import { connect } from 'react-redux';
import { Divider, List } from '@mui/material';
import WalletListElement from '../../wallet-list-element/WalletListElement';
import WalletWithErg from '../../../db/entities/views/WalletWithErg';

interface WalletSelectPropType {
  wallets: Array<WalletWithErg>;
  select: (selected: WalletWithErg) => unknown;
}
const WalletSelect = (props: WalletSelectPropType) => {
  return (
    <List>
      {props.wallets.map((wallet, index) => (
        <React.Fragment key={index}>
          <Divider />
          <WalletListElement
            network_type={wallet.network_type}
            type={wallet.type}
            id={wallet.id}
            name={wallet.name}
            erg={wallet.erg()}
            onClick={() => props.select(wallet)}
            tokens={wallet.token_count}
          />
        </React.Fragment>
      ))}
    </List>
  );
};

const mapsPropsToDispatch = (state: GlobalStateType) => ({
  wallets: state.wallet.wallets,
});

export default connect(mapsPropsToDispatch)(WalletSelect);
