import React, { useEffect, useState } from 'react';
import Wallet from '../../db/entities/Wallet';
import { UnsignedGeneratedTx } from '../../util/interface';
import MultiSigSignProcess from '../multi-sig/MultiSigSignProcess';
import Loading from '../loading/Loading';
import * as wasm from 'ergo-lib-wasm-browser';
import { throwError } from 'tiny-secp256k1/lib/validate_error';
import { BlockChainAction } from '../../action/blockchain';

interface SendConfirmMultiSigPropsType {
    close: () => any;
    wallet: Wallet;
    completed?: (txId: string) => any;
    transaction?: UnsignedGeneratedTx;
    display: boolean;
}

const SendConfirmMultiSig = (props: SendConfirmMultiSigPropsType) => {
    const [tx, setTx] = useState<wasm.ReducedTransaction | undefined>()
    const [txId, setTxId] = useState('')
    useEffect(() => {
        if(props.transaction) {
            if (props.transaction.tx instanceof wasm.ReducedTransaction) {
                if (txId !== props.transaction?.tx.unsigned_tx().id().to_str()) {
                    setTx(props.transaction.tx!)
                    setTxId(props.transaction.tx.unsigned_tx().id().to_str())
                }
            } else {
                if(txId !== props.transaction.tx.id().to_str()) {
                    BlockChainAction.createContext(props.wallet.network_type).then(ctx => {
                        const reduced = wasm.ReducedTransaction.from_unsigned_tx(
                            props.transaction?.tx as wasm.UnsignedTransaction,
                            props.transaction?.boxes!,
                            wasm.ErgoBoxes.from_boxes_json([]),
                            ctx
                        )
                        setTx(reduced)
                        setTxId(reduced.unsigned_tx().id().to_str())
                    })
                }
            }
        }else{
            setTxId('');
            setTx(undefined);
        }
    })
    return tx ? (
        <MultiSigSignProcess
            wallet={props.wallet}
            tx={tx!}
            boxes={props.transaction?.boxes!}
            close={props.close} />
    ) : <Loading />;
};

export default SendConfirmMultiSig;
