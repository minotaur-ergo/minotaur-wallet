import React, { useState } from 'react';
import * as wasm from 'ergo-lib-wasm-browser';
import * as constants from '../../../../util/const';
import { DAppPropsType } from '../../../../util/interface';
import { Button, Container, Grid } from '@mui/material';
import ErgoAmount from '../../../ergo-amount/ErgoAmount';

const encodeString = (msg: string): Uint8Array => {
  return Uint8Array.from(Buffer.from(msg));
};
const TokenIssueDApp = (props: DAppPropsType) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [decimal, setDecimal] = useState('');
  const issueToken = async () => {
    const addresses = await props.getAddresses();
    const height = await props.network_type.getNode().getHeight();
    const box_value =
      BigInt(wasm.BoxValue.SAFE_USER_MIN().as_i64().to_str()) + constants.FEE;
    const coveringBox = await props.getCoveringForErgAndToken(box_value, []);
    if (coveringBox.covered) {
      const boxes = coveringBox.boxes;
      const remainingTokens: { [id: string]: bigint } = {};
      const totalErg: bigint =
        Array(boxes.len())
          .fill('')
          .map((item, index) => {
            const box = boxes.get(index);
            Array(box.tokens().len())
              .fill('')
              .forEach((item, token_index) => {
                const token = box.tokens().get(token_index);
                if (
                  Object.prototype.hasOwnProperty.call(
                    remainingTokens,
                    token.id().to_str()
                  )
                ) {
                  remainingTokens[token.id().to_str()] += BigInt(
                    token.amount().as_i64().to_str()
                  );
                } else {
                  remainingTokens[token.id().to_str()] = BigInt(
                    token.amount().as_i64().to_str()
                  );
                }
              });
            return BigInt(box.value().as_i64().to_str());
          })
          .reduce((a, b) => a + b, BigInt(0)) - constants.FEE;
      const candidate_builder = new wasm.ErgoBoxCandidateBuilder(
        wasm.BoxValue.from_i64(wasm.I64.from_str(totalErg.toString())),
        wasm.Contract.pay_to_address(wasm.Address.from_base58(addresses[0])),
        height
      );
      candidate_builder.add_token(
        wasm.TokenId.from_str(boxes.get(0).box_id().to_str()),
        wasm.TokenAmount.from_i64(wasm.I64.from_str(amount))
      );
      candidate_builder.set_register_value(
        4,
        wasm.Constant.from_byte_array(encodeString(name))
      );
      candidate_builder.set_register_value(
        5,
        wasm.Constant.from_byte_array(encodeString(description))
      );
      candidate_builder.set_register_value(
        6,
        wasm.Constant.from_byte_array(encodeString(decimal.toString()))
      );
      candidate_builder.set_register_value(
        7,
        wasm.Constant.from_byte_array(encodeString('1'))
      );
      Object.keys(remainingTokens).forEach((token_id) => {
        candidate_builder.add_token(
          wasm.TokenId.from_str(token_id),
          wasm.TokenAmount.from_i64(
            wasm.I64.from_str(remainingTokens[token_id].toString())
          )
        );
      });
      const candidate = candidate_builder.build();
      const tx = wasm.TxBuilder.new(
        new wasm.BoxSelection(boxes, new wasm.ErgoBoxAssetsDataList()),
        new wasm.ErgoBoxCandidates(candidate),
        height,
        wasm.BoxValue.from_i64(wasm.I64.from_str(constants.FEE.toString())),
        wasm.Address.from_base58(addresses[0])
      ).build();
      await props.signAndSendTx({ tx: tx, boxes: boxes });
    } else {
      props.showNotification('Insufficient Ergs to issue new token', 'error');
    }
  };
  const valid =
    name !== '' &&
    description !== '' &&
    !isNaN(Number(amount)) &&
    !isNaN(Number(decimal));
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ErgoAmount
            size={'small'}
            value={name}
            label={'Token Name'}
            setValue={(value) => setName(value)}
          />
          <ErgoAmount
            size={'small'}
            value={description}
            label={'Token Description'}
            setValue={(value) => setDescription(value)}
          />
          <ErgoAmount
            size={'small'}
            value={amount}
            label={'Amount'}
            setValue={(value) => setAmount(value)}
          />
          <ErgoAmount
            size={'small'}
            value={decimal}
            label={'Decimal'}
            setValue={(value) => setDecimal(value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            disabled={!valid}
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => issueToken()}
          >
            Issue token
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TokenIssueDApp;
