import React from 'react';
import ErgoAmount from '../../ergo-amount/ErgoAmount';
import { Receiver, ReceiverToken } from '../../../action/blockchain';
import TokenSelect from './TokenSelect';
import TokenWithAddress from '../../../db/entities/views/AddressToken';
import AddressInput from '../../inputs/AddressInput';
import { WalletQrCodeContext } from '../wallet/types';
import { is_valid_address } from '../../../util/util';
import TokenName from '../../value/TokenName';

interface PropsType {
  value: Receiver;
  remaining: bigint;
  setValue: (value: Receiver) => unknown;
  tokens: Array<TokenWithAddress>;
  network_type: string;
}

interface StateType {
  address: string;
  amount: string;
  tokens: { id: string; amount: string };
}

class ReceiverRow extends React.Component<PropsType, StateType> {
  fillAddress = (newAddress: string) => {
    const newReceiver = this.props.value.clone();
    newReceiver.address = newAddress;
    this.props.setValue(newReceiver);
  };

  fillAmount = (amount_str: string) => {
    const newReceiver = this.props.value.clone();
    newReceiver.erg_str = amount_str;
    this.props.setValue(newReceiver);
  };

  updateTokenAt = (index: number, amount_str: string) => {
    const newReceiver = this.props.value.clone();
    newReceiver.tokens[index].amount_str = amount_str;
    this.props.setValue(newReceiver);
  };

  addToken = (tokenId: string) => {
    if (
      this.props.value.tokens.filter((item) => item.token_id === tokenId)
        .length === 0
    ) {
      const newReceiver = this.props.value.clone();
      newReceiver.tokens.push(
        new ReceiverToken(tokenId, '', this.props.network_type)
      );
      this.props.setValue(newReceiver);
    }
  };

  render = () => {
    const tokens = this.props.value.tokens.map((item) => item.token_id);
    const availableTokens = this.props.tokens.filter(
      (item) => tokens.indexOf(item.token_id) === -1
    );
    return (
      <React.Fragment>
        <AddressInput
          address={this.props.value.address}
          size={'small'}
          setAddress={this.fillAddress}
          contextType={WalletQrCodeContext}
          error={
            is_valid_address(this.props.value.address) ? '' : 'Invalid Address'
          }
          label="Receiver Address"
        />
        <ErgoAmount
          size="small"
          label="ERG"
          value={this.props.value.erg_str}
          setValue={(val: string) => this.fillAmount(val)}
        />
        {this.props.value.tokens.map((token, index) => (
          <ErgoAmount
            size="small"
            key={index}
            value={token.amount_str}
            setValue={(amount) => this.updateTokenAt(index, amount)}
            label={
              <TokenName
                token_id={token.token_id}
                network_type={this.props.network_type}
              />
            }
          />
        ))}
        <TokenSelect
          tokens={availableTokens}
          addToken={this.addToken}
          network_type={this.props.network_type}
        />
      </React.Fragment>
    );
  };
}

export default ReceiverRow;
