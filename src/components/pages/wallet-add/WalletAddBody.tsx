import React, { useState } from 'react';
import WalletInsertOption from './WalletInsertOption';
import InsertWallet from './insert/InsertWallet';
import RestoreWallet from './restore/RestoreWallet';
import ReadOnlyWallet from './readonly/ReadOnlyWallet';
import MultiSigWallet from './multisig/MultiSigWallet';
import { WalletCreateType } from './walletCreateType';
import { useNavigate } from 'react-router-dom';

const WalletAddBody = () => {
  const navigate = useNavigate();
  const [walletType, setWalletType] = useState<WalletCreateType | null>(null);
  return (
    <div style={{ marginTop: '20px' }}>
      {walletType === null ? (
        <WalletInsertOption setWalletType={setWalletType} />
      ) : null}
      {walletType === WalletCreateType.New ? (
        <InsertWallet navigate={navigate} back={() => setWalletType(null)} />
      ) : null}
      {walletType === WalletCreateType.Restore ? (
        <RestoreWallet navigate={navigate} back={() => setWalletType(null)} />
      ) : null}
      {walletType === WalletCreateType.ReadOnly ? (
        <ReadOnlyWallet navigate={navigate} back={() => setWalletType(null)} />
      ) : null}
      {walletType === WalletCreateType.MultiSig ? (
        <MultiSigWallet navigate={navigate} back={() => setWalletType(null)} />
      ) : null}
    </div>
  );
};

export default WalletAddBody;

export { WalletCreateType };
