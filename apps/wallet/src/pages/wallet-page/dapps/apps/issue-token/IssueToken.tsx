import { useEffect, useState } from 'react';
import { Button, Stack } from '@mui/material';
import * as wasm from 'ergo-lib-wasm-browser';
import { createEmptyArrayWithIndex } from '@/utils/functions';
import { DAppPropsType } from '@minotaur-ergo/types';
import TextField from '@/components/text-field/TextField';

const encodeString = (msg: string): Uint8Array => {
  return Uint8Array.from(Buffer.from(msg));
};

const fee = BigInt(1000000);

const IssueToken = (props: DAppPropsType) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [decimal, setDecimal] = useState('');
  const [hasError, setHasError] = useState(false);
  const issueToken = async () => {
    const address = await props.getDefaultAddress();
    const height = await props.chain.getNetwork().getHeight();
    const box_value =
      BigInt(wasm.BoxValue.SAFE_USER_MIN().as_i64().to_str()) + fee;
    const coveringBox = await props.getCoveringForErgAndToken(box_value, []);
    if (coveringBox.covered) {
      const boxes = coveringBox.boxes;
      const remainingTokens: { [id: string]: bigint } = {};
      const totalErg: bigint =
        createEmptyArrayWithIndex(boxes.len())
          .map((index) => {
            const box = boxes.get(index);
            const tokens = box.tokens();
            createEmptyArrayWithIndex(tokens.len()).forEach((token_index) => {
              const token = tokens.get(token_index);
              if (
                Object.prototype.hasOwnProperty.call(
                  remainingTokens,
                  token.id().to_str(),
                )
              ) {
                remainingTokens[token.id().to_str()] += BigInt(
                  token.amount().as_i64().to_str(),
                );
              } else {
                remainingTokens[token.id().to_str()] = BigInt(
                  token.amount().as_i64().to_str(),
                );
              }
            });
            return BigInt(box.value().as_i64().to_str());
          })
          .reduce((a, b) => a + b, BigInt(0)) - fee;
      const candidateBuilder = new wasm.ErgoBoxCandidateBuilder(
        wasm.BoxValue.from_i64(wasm.I64.from_str(totalErg.toString())),
        wasm.Contract.pay_to_address(wasm.Address.from_base58(address)),
        height,
      );
      candidateBuilder.add_token(
        wasm.TokenId.from_str(boxes.get(0).box_id().to_str()),
        wasm.TokenAmount.from_i64(wasm.I64.from_str(amount)),
      );
      candidateBuilder.set_register_value(
        4,
        wasm.Constant.from_byte_array(encodeString(name)),
      );
      candidateBuilder.set_register_value(
        5,
        wasm.Constant.from_byte_array(encodeString(description)),
      );
      candidateBuilder.set_register_value(
        6,
        wasm.Constant.from_byte_array(encodeString(decimal.toString())),
      );
      candidateBuilder.set_register_value(
        7,
        wasm.Constant.from_byte_array(encodeString('1')),
      );
      Object.keys(remainingTokens).forEach((token_id) => {
        candidateBuilder.add_token(
          wasm.TokenId.from_str(token_id),
          wasm.TokenAmount.from_i64(
            wasm.I64.from_str(remainingTokens[token_id].toString()),
          ),
        );
      });
      const candidate = candidateBuilder.build();
      const tx = wasm.TxBuilder.new(
        new wasm.BoxSelection(boxes, new wasm.ErgoBoxAssetsDataList()),
        new wasm.ErgoBoxCandidates(candidate),
        height,
        wasm.BoxValue.from_i64(wasm.I64.from_str(fee.toString())),
        wasm.Address.from_base58(address),
      ).build();
      await props.signAndSendTx({ tx, boxes });
    } else {
      props.showNotification('Insufficient Ergs to issue new token', 'error');
    }
  };
  useEffect(() => {
    try {
      setHasError(
        BigInt(amount) <= 0n || (decimal !== '' && isNaN(parseInt(decimal))),
      );
    } catch {
      setHasError(true);
    }
  }, [amount, decimal]);
  return (
    <Stack spacing={2}>
      <TextField
        label="Token Name"
        value={name}
        onChange={({ target }) => setName(target.value)}
      />
      <TextField
        label="Token Description"
        value={description}
        onChange={({ target }) => setDescription(target.value)}
      />
      <TextField
        label="Amount"
        value={amount}
        onChange={({ target }) => setAmount(target.value)}
      />
      <TextField
        label="Decimal"
        value={decimal}
        onChange={({ target }) => setDecimal(target.value)}
      />
      <Button disabled={hasError} onClick={issueToken}>
        Issue Token
      </Button>
    </Stack>
  );
};

export default IssueToken;
