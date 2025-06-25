import React, { useState } from 'react';

import { DAppPropsType, UnsignedGeneratedTx } from '@minotaur-ergo/types';
import { boxesToArrayBox } from '@minotaur-ergo/utils';
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import * as wasm from 'ergo-lib-wasm-browser';

import DisplayId from '@/components/display-id/DisplayId';
import LoadingPage from '@/components/loading-page/LoadingPage';

import getColor from './getColor';
import OldestBoxAge from './OldestBoxAge';
import { CONSOLIDATE_FEE, IMPLEMENTOR, TRANSACTION_FEE } from './parameters';
import UnspentBoxesCount from './UnspentBoxesCount';
import useAddressBoxes from './useAddressBoxes';
import useAddresses from './useAddresses';

const BoxConsolidation = (props: DAppPropsType) => {
  const addresses = useAddresses(props);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const state = useAddressBoxes(addresses.addresses, selectedAddress, props);
  const [generating, setGenerating] = useState(false);
  const handleChangeAddress = (event: SelectChangeEvent) => {
    const index = parseInt(event.target.value);
    if (!isNaN(index) && index >= 0 && index < addresses.addresses.length) {
      setSelectedAddress(index);
    }
  };
  const boxCountConsolidate = state.boxesCount >= 100;
  const ageConsolidate = state.oldestAge >= 3.0;
  const consolidate = boxCountConsolidate || ageConsolidate;
  const generateTransaction = () => {
    if (!generating) {
      setGenerating(true);
      props
        .getCoveringForErgAndToken(
          999999999000000000n,
          [],
          addresses.addresses[selectedAddress],
        )
        .then((covering) => {
          const height = state.height;
          const boxArray = boxesToArrayBox(covering.boxes);
          const totalErg = boxArray
            .map((item) => BigInt(item.value().as_i64().to_str()))
            .reduce((a, b) => a + b, 0n);
          const outputCandidates = wasm.ErgoBoxCandidates.empty();
          const consolidated = new wasm.ErgoBoxCandidateBuilder(
            wasm.BoxValue.from_i64(
              wasm.I64.from_str(
                (totalErg - TRANSACTION_FEE - CONSOLIDATE_FEE).toString(),
              ),
            ),
            wasm.Contract.pay_to_address(
              wasm.Address.from_base58(addresses.addresses[selectedAddress]),
            ),
            height,
          );
          const tokensAmount = new Map<string, bigint>();
          boxArray.forEach((box) => {
            const tokens = box.tokens();
            for (let index = 0; index < tokens.len(); index++) {
              const token = tokens.get(index);
              const tokenId = token.id().to_str();
              const amount = BigInt(token.amount().as_i64().to_str());
              tokensAmount.set(
                tokenId,
                amount + (tokensAmount.get(tokenId) ?? 0n),
              );
            }
          });
          tokensAmount.forEach((value, key) => {
            consolidated.add_token(
              wasm.TokenId.from_str(key),
              wasm.TokenAmount.from_i64(wasm.I64.from_str(value.toString())),
            );
          });
          outputCandidates.add(consolidated.build());
          if (CONSOLIDATE_FEE > 0n) {
            const feeBox = new wasm.ErgoBoxCandidateBuilder(
              wasm.BoxValue.from_i64(
                wasm.I64.from_str(CONSOLIDATE_FEE.toString()),
              ),
              wasm.Contract.pay_to_address(
                wasm.Address.from_base58(IMPLEMENTOR),
              ),
              height,
            ).build();
            outputCandidates.add(feeBox);
          }
          const tx = wasm.TxBuilder.new(
            new wasm.BoxSelection(
              covering.boxes,
              new wasm.ErgoBoxAssetsDataList(),
            ),
            outputCandidates,
            height,
            wasm.BoxValue.from_i64(
              wasm.I64.from_str(TRANSACTION_FEE.toString()),
            ),
            wasm.Address.from_base58(addresses.addresses[selectedAddress]),
          ).build();
          const reduced = wasm.ReducedTransaction.from_unsigned_tx(
            tx,
            covering.boxes,
            wasm.ErgoBoxes.empty(),
            props.chain.fakeContext(),
          );
          const request: UnsignedGeneratedTx = {
            boxes: covering.boxes,
            tx: reduced,
          };
          props.signAndSendTx(request);
          setGenerating(false);
        });
    }
  };
  return (
    <React.Fragment>
      <FormControl sx={{ mb: 2 }}>
        <InputLabel>Address</InputLabel>
        <Select
          value={selectedAddress.toString()}
          onChange={handleChangeAddress}
        >
          {addresses.addresses.map((item, index) => (
            <MenuItem key={item} value={index.toString()}>
              <DisplayId id={item} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {addresses.loading || state.loading ? (
        <LoadingPage title="Loading address boxes" description="Please wait" />
      ) : state.boxesCount === 0 ? (
        <Typography>There is no boxes in this address</Typography>
      ) : (
        <React.Fragment>
          <UnspentBoxesCount
            consolidate={boxCountConsolidate}
            boxCount={state.boxesCount}
          />
          <OldestBoxAge age={state.oldestAge} consolidate={ageConsolidate} />
          <Divider />

          <Typography
            textAlign="center"
            fontSize="x-large"
            color={getColor(consolidate)}
            mt={3}
            mb={2}
          >
            {consolidate ? 'Consider consolidation' : 'You are fine!'}
          </Typography>
          <Typography
            textAlign="center"
            variant="body2"
            color="textSecondary"
            mb={3}
          >
            You can renew {state.boxesCount} box
            {state.boxesCount > 1 ? 'es' : ''}{' '}
            {consolidate ? '' : ', but it is not necessary.'}
          </Typography>
          <Button onClick={generateTransaction}>
            {/* {generating ? <Loading/> : undefined} */}
            Renew {state.boxesCount} box{state.boxesCount > 1 ? 'es' : ''}
          </Button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default BoxConsolidation;
