import React from 'react';
import TransactionElement from './TransactionElement';
import WalletTx from '../../../db/entities/views/WalletTx';
import * as wasm from 'ergo-lib-wasm-browser';
import TxBoxDisplay from '../../../components/display-tx/TxBoxDisplay';
import { InputBox } from '../../../util/network/models';
import { WalletPagePropsType } from '../../../util/interface';
import { TxDbAction } from '../../../action/db';
import { INC_LIMIT } from '../../../util/const';
import { Button, Divider, List } from '@mui/material';
import { getNetworkType } from '../../../util/network_type';
import openInBrowser from '../../../util/browser';

interface TransactionStateType {
  transactions: Array<WalletTx>;
  addressValid: boolean;
  displayTx: boolean;
  inputs: Array<InputBox>;
  limit: number;
  loadedLimit: number;
  outputs: Array<wasm.ErgoBox>;
}

class Transaction extends React.Component<
  WalletPagePropsType,
  TransactionStateType
> {
  state: TransactionStateType = {
    transactions: [],
    addressValid: false,
    displayTx: false,
    inputs: [],
    outputs: [],
    limit: 10,
    loadedLimit: 0,
  };

  loadTransactions = () => {
    if (this.state.limit !== this.state.loadedLimit) {
      const loadedLimit = this.state.limit;
      TxDbAction.getWalletTx(this.props.wallet.id, this.state.limit, 0).then(
        (dbTransaction) => {
          this.setState({
            transactions: dbTransaction,
            loadedLimit: loadedLimit,
          });
        }
      );
    }
  };

  loadMore = () => {
    this.setState((state) => ({ ...state, limit: state.limit + INC_LIMIT }));
  };

  selectTransaction = (index: number) => {
    if (index < this.state.transactions.length && index >= 0) {
      // TODO must display transaction parts
      const tx = this.state.transactions[index];
      const networkType = getNetworkType(tx.network_type);
      const url = `${networkType.explorer_front}/en/transactions/${tx.tx_id}`;
      openInBrowser(url);
      // const txJson = JsonAllBI.parse(this.state.transactions[index].json);
      // const inputs = txJson.inputs as Array<InputBox>;
      // const outputs = txJson.outputs.map((item: any) => wasm.ErgoBox.from_json(JsonAllBI.stringify(item)));
      // this.setState({
      //     displayTx: true,
      //     inputs: inputs,
      //     outputs: outputs
      // });
    }
  };

  componentDidUpdate = () => {
    this.loadTransactions();
  };

  componentDidMount = () => {
    this.loadTransactions();
    this.props.setTab('transaction');
  };

  render = () => {
    return (
      <React.Fragment>
        <List>
          {this.state.transactions.map(
            (transaction: WalletTx, index: number) => (
              <React.Fragment key={transaction.id}>
                <TransactionElement
                  transaction={transaction}
                  handleClick={() => this.selectTransaction(index)}
                />
                <Divider />
              </React.Fragment>
            )
          )}
          {this.state.transactions.length === this.state.limit ? (
            <Button fullWidth color={'primary'} onClick={() => this.loadMore()}>
              Load More Transactions
            </Button>
          ) : null}
        </List>
        <TxBoxDisplay
          network_type={
            this.state.transactions.length
              ? this.state.transactions[0].network_type
              : ''
          }
          show={this.state.displayTx}
          inputsJs={this.state.inputs}
          close={() => this.setState({ displayTx: false })}
          outputs={this.state.outputs}
        />
      </React.Fragment>
    );
  };
}

export default Transaction;
