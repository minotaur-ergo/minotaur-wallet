import React from "react";
import AddressInput from "../../../components/AddressInput";
import ErgoAmount from "./ErgoAmount";
import { Receiver, ReceiverToken } from "../../../action/blockchain";
import { is_valid_address } from "../../../utils/utils";
import { Divider } from "@material-ui/core";
import TokenSelect from "./TokenSelect";
import TokenWithAddress from "../../../db/entities/views/AddressToken";
import TokenName from "../../../components/TokenName";

interface PropsType {
    value: Receiver;
    remaining: bigint;
    setValue: (value: Receiver) => any;
    tokens: Array<TokenWithAddress>;
    network_type: string;
}

interface StateType {
    address: string;
    amount: string;
    tokens: { id: string, amount: string };
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
    }

    updateTokenAt = (index: number, amount_str: string) => {
        const newReceiver = this.props.value.clone();
        newReceiver.tokens[index].amount_str = amount_str;
        this.props.setValue(newReceiver);
    }

    addToken = (tokenId: string) => {
        if (this.props.value.tokens.filter(item => item.token_id === tokenId).length === 0) {
            const newReceiver = this.props.value.clone();
            newReceiver.tokens.push(new ReceiverToken(tokenId, "", this.props.network_type));
            this.props.setValue(newReceiver);
        }
    }

    render = () => {
        const tokens = this.props.value.tokens.map(item => item.token_id);
        const availableTokens = this.props.tokens.filter(item => tokens.indexOf(item.token_id) === -1);
        return (
            <React.Fragment>
                <AddressInput
                    address={this.props.value.address}
                    size={"small"}
                    setAddress={this.fillAddress}
                    error={is_valid_address(this.props.value.address) ? "" : "Invalid Address"}
                    label="Receiver Address" />
                <ErgoAmount
                    size="small"
                    label="Erg"
                    value={this.props.value.erg_str}
                    setValue={(val: string) => this.fillAmount(val)}
                />
                {this.props.value.tokens.map((token, index) => (
                    <ErgoAmount
                        size="small"
                        key={index}
                        value={token.amount_str}
                        setValue={amount => this.updateTokenAt(index, amount)}
                        label={<TokenName token_id={token.token_id} network_type={this.props.network_type}/>} />
                ))}
                <TokenSelect tokens={availableTokens} addToken={this.addToken} network_type={this.props.network_type}/>
                <Divider style={{ marginTop: 10 }} />
            </React.Fragment>
        );
    };
}

export default ReceiverRow;
