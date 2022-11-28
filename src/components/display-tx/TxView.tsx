import React from 'react';
import * as wasm from 'ergo-lib-wasm-browser';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Inbox } from '@mui/icons-material';
import TotalAmount from './TotalAmount';
import TxBoxDisplay from './TxBoxDisplay';
import { getNetworkType } from '../../util/network_type';
import { JsonBI } from '../../util/json';

interface TxViewPropsType {
  tx: wasm.UnsignedTransaction | wasm.Transaction;
  boxes: Array<wasm.ErgoBox>;
  addresses: Array<string>;
  children?: React.ReactNode;
  network_type: string;
}

interface TxViewStateType {
  loading: boolean;
  txId: string;
  assets: { [id: string]: bigint };
  inputs: Array<wasm.ErgoBox>;
  outputs: Array<wasm.ErgoBox | wasm.ErgoBoxCandidate>;
  isMined: boolean;
  showBoxes: boolean;
  showSendModal: boolean;
}

class TxView extends React.Component<TxViewPropsType, TxViewStateType> {
  state: TxViewStateType = {
    assets: { erg: BigInt(0) },
    inputs: [],
    outputs: [],
    loading: false,
    txId: '',
    isMined: false,
    showBoxes: false,
    showSendModal: false,
  };

  i64ToBigInt = (value: wasm.I64) => BigInt(value.to_str());

  processBox = (
    box: wasm.ErgoBox | wasm.ErgoBoxCandidate,
    sign: -1 | 1,
    assets: { [id: string]: bigint }
  ) => {
    const signBigInt = BigInt(sign);
    assets.erg += BigInt(box.value().as_i64().to_str()) * signBigInt;
    const tokens = box.tokens();
    for (let index = 0; index < tokens.len(); index++) {
      const token = tokens.get(index);
      if (Object.prototype.hasOwnProperty.call(assets, token.id().to_str())) {
        assets[token.id().to_str()] +=
          this.i64ToBigInt(token.amount().as_i64()) * signBigInt;
      } else {
        assets[token.id().to_str()] =
          this.i64ToBigInt(token.amount().as_i64()) * signBigInt;
      }
    }
  };

  extractAssets = async () => {
    if (
      !this.state.loading &&
      this.state.txId !== this.props.tx.id().to_str()
    ) {
      const network_type = getNetworkType(this.props.network_type);
      const tx = this.props.tx;
      const wasmOutputs =
        tx instanceof wasm.Transaction ? tx.outputs() : tx.output_candidates();
      const outputs = Array(wasmOutputs.len())
        .fill('')
        .map((item, index) => wasmOutputs.get(index));
      this.setState({ loading: true });
      const txId = tx.id().to_str();
      const assets: { [id: string]: bigint } = { erg: BigInt(0) };
      const boxes: { [id: string]: wasm.ErgoBox } = {};
      if (this.props.boxes) {
        this.props.boxes.forEach((box) => (boxes[box.box_id().to_str()] = box));
      }
      // load boxes if not available
      const input_boxes: Array<wasm.ErgoBox> = [];
      for (let index = 0; index < tx.inputs().len(); index++) {
        const input = tx.inputs().get(index);
        if (
          Object.prototype.hasOwnProperty.call(boxes, input.box_id().to_str())
        ) {
          input_boxes.push(boxes[input.box_id().to_str()]);
        } else {
          const boxJson = await network_type
            .getExplorer()
            .getBoxById(input.box_id().to_str());
          input_boxes.push(wasm.ErgoBox.from_json(JsonBI.stringify(boxJson)));
        }
      }
      input_boxes.forEach((box) => {
        if (
          this.props.addresses.indexOf(
            wasm.Address.recreate_from_ergo_tree(box.ergo_tree()).to_base58(
              network_type.prefix
            )
          ) >= 0
        ) {
          this.processBox(box, -1, assets);
        }
      });
      outputs.forEach((box) => {
        if (
          this.props.addresses.indexOf(
            wasm.Address.recreate_from_ergo_tree(box.ergo_tree()).to_base58(
              network_type.prefix
            )
          ) >= 0
        ) {
          this.processBox(box, 1, assets);
        }
      });
      this.setState({
        assets: assets,
        inputs: input_boxes,
        outputs: outputs,
        loading: false,
        txId: txId,
        isMined: tx instanceof wasm.Transaction,
      });
    }
  };

  componentDidMount() {
    this.extractAssets().then(() => null);
  }

  componentDidUpdate() {
    this.extractAssets().then(() => null);
  }

  render = () => {
    return (
      <React.Fragment>
        <List>
          <TotalAmount
            network_type={this.props.network_type}
            assets={this.state.assets}
            sign={-1}
            title="Total Spent"
            description={
              this.state.isMined
                ? 'These amount spent in transaction'
                : 'These amount will be spent when transaction proceed'
            }
          />
          <TotalAmount
            network_type={this.props.network_type}
            assets={this.state.assets}
            sign={1}
            title="Total Income"
            description="These amount will be charged to your account when transaction proceed"
          />
          <ListItem button onClick={() => this.setState({ showBoxes: true })}>
            <ListItemIcon>
              <Inbox />
            </ListItemIcon>
            <ListItemText primary="Show Boxes" />
          </ListItem>
          {this.props.children}
        </List>
        <TxBoxDisplay
          network_type={this.props.network_type}
          show={this.state.showBoxes}
          inputs={this.state.inputs}
          close={() => this.setState({ showBoxes: false })}
          outputs={this.state.outputs}
          allowedAssets={Object.keys(this.state.assets)}
        />
      </React.Fragment>
    );
  };
}

export default TxView;
