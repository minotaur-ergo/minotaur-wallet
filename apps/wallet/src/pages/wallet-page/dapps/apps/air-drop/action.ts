import * as wasm from '@minotaur-ergo/ergo-lib';
import { DAppPropsType, TokenAmount } from '@minotaur-ergo/types';

import {
  IMPL_ADDRESS,
  IMPL_FEE,
  TX_FEE,
} from '@/pages/wallet-page/dapps/apps/air-drop/params';

export const airdrop = async (
  props: DAppPropsType,
  addresses: Array<string>,
  amounts: TokenAmount,
  ergAmount: bigint,
) => {
  try {
    const address = await props.getDefaultAddress();
    const height = await props.chain.getNetwork().getHeight();
    const airdrops = BigInt(addresses.length);
    const selectedTokens = Object.entries(amounts).map((item) => ({
      tokenId: item[0],
      balance: item[1].amount * airdrops,
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
          if (amounts[tokenId].amount > 0n) {
            builder.add_token(
              wasm.TokenId.from_str(tokenId),
              wasm.TokenAmount.from_i64(
                wasm.I64.from_str(amounts[tokenId].amount.toString()),
              ),
            );
          }
        }
        candidates.add(builder.build());
      });
      const feeBox = new wasm.ErgoBoxCandidateBuilder(
        wasm.BoxValue.from_i64(wasm.I64.from_str(IMPL_FEE.toString())),
        wasm.Contract.pay_to_address(wasm.Address.from_base58(IMPL_ADDRESS)),
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
};
