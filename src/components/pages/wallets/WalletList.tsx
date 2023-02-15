import React from 'react';
import { Divider, List } from '@mui/material';
import { connect } from 'react-redux';
import { GlobalStateType } from '../../../store/reducer';
import WalletWithErg from '../../../db/entities/views/WalletWithErg';
import WalletListElement from '../../wallet-list-element/WalletListElement';

interface PropsType {
  wallets: Array<WalletWithErg>;
}

const WalletList = (props: PropsType) => {
  return (
    <List>
      {props.wallets.map((wallet, index) => (
        <React.Fragment key={index}>
          <WalletListElement
            network_type={wallet.network_type}
            type={wallet.type}
            id={wallet.id}
            name={wallet.name}
            erg={wallet.erg()}
            tokens={wallet.token_count}
          />
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

const mapStateToProps = (state: GlobalStateType) => ({
  wallets: state.wallet.wallets,
});

export default connect(mapStateToProps)(WalletList);
