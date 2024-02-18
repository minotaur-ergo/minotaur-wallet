import React, { useEffect, useState } from 'react';
import { newEmptyReceiver } from '../../../action/tx';
import { ReceiverType } from '../../../types/sign-modal';
import { StateWallet } from '../../../store/reducer/wallet';
import TxGenerateContext from './TxGenerateContext';

interface TxGenerateContextHandlerPropsType {
  wallet: StateWallet;
  children: React.ReactNode;
}

const TxGenerateContextHandler = (props: TxGenerateContextHandlerPropsType) => {
  const [receivers, setReceivers] = useState<Array<ReceiverType>>([
    newEmptyReceiver(),
  ]);
  const [selectedAddresses, setSelectedAddresses] = useState<
    'all' | Array<string>
  >('all');
  const [ready, setReady] = useState(false);
  const [total, setTotal] = useState(0n);
  const [tokens, setTokens] = useState<{ [tokenId: string]: bigint }>({});
  const [updatedAddress, setUpdatedAddress] = useState('');

  const edit = (index: number, value: Partial<ReceiverType>) => {
    const newReceivers = [...receivers];
    newReceivers[index] = { ...newReceivers[index], ...value };
    setReceivers(newReceivers);
  };
  useEffect(() => {
    if (updatedAddress !== selectedAddresses) {
      const addresses = props.wallet.addresses.filter(
        (a) =>
          selectedAddresses === 'all' || selectedAddresses.includes(`${a.id}`),
      );
      setTotal(addresses.reduce((a, b) => a + BigInt(b.balance), 0n));
      const tokens: { [tokenId: string]: bigint } = {};
      addresses.forEach((address) => {
        address.tokens.map((token) => {
          tokens[token.tokenId] =
            (tokens[token.tokenId] || 0n) + BigInt(token.balance);
        });
      });
      setTokens(tokens);
      setUpdatedAddress(JSON.stringify(selectedAddresses));
    }
  }, [updatedAddress, selectedAddresses, props.wallet.addresses]); // getAddress must not used as dependency

  const updateReady = (newReady: boolean) => {
    if (ready !== newReady) setReady(newReady);
  };
  return (
    <TxGenerateContext.Provider
      value={{
        total,
        tokens,
        ready,
        setReady: updateReady,
        edit,
        setSelectedAddresses,
        receivers,
        setReceivers,
        selectedAddresses,
      }}
    >
      {props.children}
    </TxGenerateContext.Provider>
  );
};

export default TxGenerateContextHandler;
