import FillAmounts from '@/components/select-tokens/FillAmounts';
import TokenAmountInput from '@/components/token-amount-input/TokenAmountInput';
import Addresses from '@/pages/wallet-page/dapps/apps/air-drop/Addresses';
import React from 'react';
import SelectTokens from '@/components/select-tokens/SelectTokens';
import { AssetInfo, DAppPropsType, TokenAmount } from '@/types/dapps';
import { Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import * as wasm from 'ergo-lib-wasm-browser';

const TX_FEE = 2000000n;
const IMPL_FEE = 50000000n;
const IMPL_ADDRESS = '9hN2UY1ZvvWMeWRBso28vSyjrAAfGJHh2DkZpE47J7Wqr51YLAR';

const AirDrop = (props: DAppPropsType) => {
  const [addresses, setAddresses] = useState<Array<string>>(['']);
  const [ergAmount, setErgAmount] = useState(0n);
  const [totalErg, setTotalErg] = useState(0n);
  const [amounts, setAmounts] = useState<TokenAmount>({});
  const [tokens, setTokens] = useState<Array<AssetInfo>>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedTokenIds, setSelectedTokenIds] = useState<Array<string>>([]);
  const [addressError, setAddressError] = useState(false);
  const [acting, setActing] = useState(false);
  props.chain.prefix;

  useEffect(() => {
    if (!loaded) {
      props.getAssets().then((tokens) => {
        props.getTokenAmount().then((res) => {
          setLoaded(true);
          setTotalErg(res - TX_FEE - IMPL_FEE);
        });
        setTokens(tokens);
      });
    }
  });

  const divisor = BigInt(Math.max(addresses.length, 1));
  const ergError =
    ergAmount < totalErg &&
    ergAmount < BigInt(wasm.BoxValue.SAFE_USER_MIN().as_i64().to_str());
  const airdrop = async () => {
    if (!acting && !ergError && !addressError) {
      setActing(true);
      try {
        const address = await props.getDefaultAddress();
        const height = await props.chain.getNetwork().getHeight();
        const airdrops = BigInt(addresses.length);
        const selectedTokens = Object.entries(amounts).map((item) => ({
          id: item[0],
          amount: item[1].amount * airdrops,
        }));
        const coveringBox = await props.getCoveringForErgAndToken(
          ergAmount * airdrops + TX_FEE + IMPL_FEE,
          selectedTokens,
        );
        if (coveringBox.covered) {
          const candidates = wasm.ErgoBoxCandidates.empty();
          addresses.forEach((address) => {
            const builder = new wasm.ErgoBoxCandidateBuilder(
              wasm.BoxValue.from_i64(wasm.I64.from_str(ergAmount.toString())),
              wasm.Contract.pay_to_address(wasm.Address.from_base58(address)),
              height,
            );
            for (const tokenId of Object.keys(amounts)) {
              builder.add_token(
                wasm.TokenId.from_str(tokenId),
                wasm.TokenAmount.from_i64(
                  wasm.I64.from_str(amounts[tokenId].amount.toString()),
                ),
              );
            }
            candidates.add(builder.build());
          });
          const feeBox = new wasm.ErgoBoxCandidateBuilder(
            wasm.BoxValue.from_i64(wasm.I64.from_str(IMPL_FEE.toString())),
            wasm.Contract.pay_to_address(
              wasm.Address.from_base58(IMPL_ADDRESS),
            ),
            height,
          );
          candidates.add(feeBox.build());
          const changeBox = await props.createChangeBox(
            coveringBox.boxes,
            candidates,
            TX_FEE,
            height,
          );
          changeBox.forEach((item) => candidates.add(item));
          const tx = wasm.TxBuilder.new(
            new wasm.BoxSelection(
              coveringBox.boxes,
              new wasm.ErgoBoxAssetsDataList(),
            ),
            candidates,
            height,
            wasm.BoxValue.from_i64(wasm.I64.from_str(TX_FEE.toString())),
            wasm.Address.from_base58(address),
          );
          props.signAndSendTx({ tx: tx.build(), boxes: coveringBox.boxes });
        } else {
          props.showNotification('Insufficient Ergs or Tokens', 'error');
        }
      } catch (e) {
        props.showNotification(`${e}`, 'error');
      }
      setActing(false);
    }
  };
  return (
    <Stack spacing={2}>
      <Addresses
        addresses={addresses}
        network={props.chain.prefix}
        setAddresses={setAddresses}
        setHasError={setAddressError}
      />
      <TokenAmountInput
        network_type={props.chain.label}
        amount={ergAmount}
        setAmount={(newAmount) => setErgAmount(newAmount)}
        total={totalErg / BigInt(Math.max(addresses.length, 1))}
        tokenId="erg"
        availableLabel="allowed each"
      />
      {tokens.length > 0 ? (
        <React.Fragment>
          <SelectTokens
            amounts={amounts}
            setAmounts={setAmounts}
            tokenIds={selectedTokenIds}
            setTokenIds={setSelectedTokenIds}
            getAssets={props.getAssets}
            chain={props.chain}
          />
          <FillAmounts
            amounts={amounts}
            setAmounts={setAmounts}
            tokenIds={selectedTokenIds}
            chain={props.chain}
            totalCalculator={(amount) => amount / divisor}
            availableLabel="allowed each"
          />
        </React.Fragment>
      ) : undefined}
      <Button
        onClick={() => airdrop().then(() => null)}
        disabled={addressError || ergError}
      >
        Air Drop
      </Button>
    </Stack>
  );
};

export default AirDrop;
