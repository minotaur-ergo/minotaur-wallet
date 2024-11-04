import { deriveAddressFromXPub } from '@/action/address';
import { addCommitments, addProof, getCommitments, getTx } from '@/action/multi-sig-server';
import { hintBagToArray } from '@/action/multi-sig/commitment';
import { arrayToProposition, getHintBags, getInputPKs } from '@/action/multi-sig/signing';
import { fetchMultiSigRows } from '@/action/multi-sig/store';
import useMultiSigAddressHolders from '@/hooks/multi-sig/useMultiSigAddressHolders';
import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';
import useCommunicationSecret from '@/hooks/signing-server/useCommunicationSecret';
import { StateWallet } from '@/store/reducer/wallet';
import { MultiSigAddressHolder, MultiSigData } from '@/types/multi-sig';
import { boxArrayToBoxes } from '@/utils/convert';
import getChain from '@/utils/networks';
import fakeContext from '@/utils/networks/fakeContext';
import { Buffer } from 'buffer';
import * as wasm from 'ergo-lib-wasm-browser';
import { useEffect, useState } from 'react';

const useMultiSigServerRow = (
  txId: string,
  wallet: StateWallet,
  lastUpdate: number,
  extract: boolean
) => {
  const { server } = useCommunicationSecret(wallet.id, 0);
  const signer = useSignerWallet(wallet);
  const [tx, setTx] = useState<wasm.ReducedTransaction>();
  const [data, setData] = useState<MultiSigData>({
    commitments: [[]],
    secrets: [[]],
    signed: [],
    simulated: []
  });
  const [rowId, setRowId] = useState('');
  const [boxes, setBoxes] = useState<Array<wasm.ErgoBox>>([]);
  const [dataBoxes, setDataBoxes] = useState<Array<wasm.ErgoBox>>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(-1);
  const addresses = useMultiSigAddressHolders(wallet);
  const [saving, setSaving] = useState(false);
  const [loadedTxId, setLoadedTxId] = useState('');
  const [usedAddresses, setUsedAddresses] = useState<Array<MultiSigAddressHolder>>([]);
  const [refreshTicker, setRefreshTicker] = useState(0);
  const [loadedTime, setLoadedTime] = useState(-1);
  useEffect(() => {
    if (extract && server && signer && !loading && rowId !== txId) {
      setLoading(true);
      getTx(server, signer.xPub, txId).then((res) => {
        const tx = wasm.ReducedTransaction.sigma_parse_bytes(
          Buffer.from(res.reduced, 'base64')
        );
        setTx(tx);
        setBoxes(
          res.boxes.map((item) =>
            wasm.ErgoBox.sigma_parse_bytes(Buffer.from(item, 'base64'))
          )
        );
        setDataBoxes(
          res.dataInputs.map((item) =>
            wasm.ErgoBox.sigma_parse_bytes(Buffer.from(item, 'base64'))
          )
        );
        const commitments = Array(res.boxes.length)
          .fill('')
          .map(() => Array(4).fill(''));
        fetchMultiSigRows(wallet, [tx.unsigned_tx().id().to_str()], false).then(row => {
          const secrets = row.length > 0 ? row[0].secrets : Array(res.boxes.length)
            .fill('')
            .map(() => Array(4).fill(''));
          setRowId(txId);
          console.log(JSON.stringify(secrets));
          setData({
            commitments,
            secrets,
            signed: [],
            simulated: []
          });
          setLoading(false);
        });

      });
    }
  }, [wallet, extract, server, signer, txId, loading, rowId]);
  useEffect(() => {
    if (!saving && server && signer && tx && (JSON.stringify(addresses) !== JSON.stringify(usedAddresses) || lastUpdate > lastUpdateTime || loadedTxId !== tx.unsigned_tx().id().to_str())) {
      setSaving(true);
      fetchMultiSigRows(wallet, [tx.unsigned_tx().id().to_str()], false).then(row => {
        if (row.length > 0) {
          if (row[0].partial) {
            const getAddressPks = (address: Array<string>): Array<string> => {
              return addresses.filter(item => address.includes(item.address) ).reduce((a,b) => [...a, ...b.pubKeys], [] as Array<string>);
            }
            const hints = wasm.extract_hints(
              row[0].partial,
              fakeContext(),
              boxArrayToBoxes(boxes),
              boxArrayToBoxes(dataBoxes),
              arrayToProposition(getAddressPks([signer.addresses[0].address])),
              arrayToProposition([])
            );
            addProof(server, signer.xPub, txId, hints).then(() => {
              console.log('saved');
            });
          } else {
            const localCommitment = row[0].commitments;
            const localSecret = row[0].secrets;
            const diff = localCommitment.filter((row, rowIndex) =>
              row.filter((item, index) => item !== '' && data.commitments[rowIndex][index] !== item).length > 0).length > 0;
            if (diff) {
              const myCommitment = localCommitment.map((row, rowIndex) =>
                row.map((item, index) => localSecret[rowIndex][index] !== '' ? item : '')
              );
              const inputPKs = getInputPKs(wallet, addresses, tx.unsigned_tx(), boxes);
              const hintBags = getHintBags(inputPKs, myCommitment);
              addCommitments(server, signer.xPub, txId, hintBags).then(() => {
                console.log('saved');
              });
            } else {
              console.log('no diff');
            }
          }
        }
        setLoadedTxId(tx.unsigned_tx().id().to_str());
        setLastUpdateTime(lastUpdate);
        setUsedAddresses(addresses);
        setSaving(false);
      });
    }
  }, [server, signer, wallet, lastUpdateTime, saving, lastUpdate, data, usedAddresses, tx, boxes, txId, addresses, loadedTxId]);
  // update commitments automatically
  useEffect(() => {
    if (!loading && server && signer && tx && refreshTicker >= loadedTime) {
      setLoading(true);
      getCommitments(server, signer.xPub, txId).then(res => {
        const simulated: Array<string> = [];
        Object.keys(res.commitments.publicHints).forEach(inputIndex => {
          res.commitments.publicHints[inputIndex].forEach(commitment => {
            if (commitment.hint.indexOf('Simulated') !== -1) {
              const address = addresses.find(item => item.pubKeys.includes(commitment.pubkey.h));
              if (address && simulated.indexOf(address.address) === -1) {
                simulated.push(address.address);
              }
            }
          });
        });
        const signed: Array<string> = [];
        Object.keys(res.commitments.secretHints).forEach(inputIndex => {
          res.commitments.secretHints[inputIndex].forEach(commitment => {
            if (commitment.hint.indexOf('Simulated') === -1) {
              const address = addresses.find(item => item.pubKeys.includes(commitment.pubkey.h));
              if (address && signed.indexOf(address.address) === -1) {
                signed.push(address.address);
              }
            }
          });
        });
        let partial: wasm.Transaction | undefined;
        if (simulated.length > 0) {
          const wallet = wasm.Wallet.from_secrets(new wasm.SecretKeys());
          const hints = wasm.TransactionHintsBag.from_json(JSON.stringify(res.commitments));
          partial = wallet.sign_reduced_transaction_multi(tx, hints);
        }
        const prefix = getChain(wallet.networkType).prefix
        const signedAddresses = res.provers.map(item => deriveAddressFromXPub(item, prefix, 0).address)
        hintBagToArray(wallet, signer, tx.unsigned_tx(), boxes, wasm.TransactionHintsBag.from_json(JSON.stringify(res.commitments))).then(newData => {
          console.log(JSON.stringify(data.secrets))
          setData(data => ({
            ...data,
            signed: signedAddresses,
            simulated: simulated,
            partial: partial,
            commitments: newData
          }));
          setLoadedTime(Date.now);
          setLoading(false);
        });
      });
    }
  }, [addresses, server, signer, loading, tx, boxes, txId, wallet, refreshTicker, loadedTime]);
  // update signature automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTicker(Date.now());
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  const storeData = (data: MultiSigData) => {
    setData(oldData => ({
      ...oldData,
      secrets: data.secrets
    }))
  };
  return {
    rowId: -1,
    serverId: txId,
    tx,
    data,
    boxes,
    dataBoxes,
    storeData
  };
};

export default useMultiSigServerRow;
