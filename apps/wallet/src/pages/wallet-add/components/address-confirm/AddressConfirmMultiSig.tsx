import { useEffect, useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { generateMultiSigAddressFromPublicKeys } from '@/action/address';
import CopyToClipboardIcon from '@/components/copy-to-clipboard/CopyToClipboardIcon';
import { GlobalStateType } from '@/store';
import DisplayId from '@/components/display-id/DisplayId';
import { bip32, getBase58ExtendedPublicKey } from '@/utils/functions';
import getChain from '@/utils/networks';

interface AddressConfirmMultiSigPropsType {
  xPubs: Array<string>;
  walletId: string;
  threshold: number;
  signers: number;
  version: number;
}

const AddressConfirmMultiSig = (props: AddressConfirmMultiSigPropsType) => {
  const [stored, setStored] = useState({
    address: '',
    walletId: '',
    xPubsJoined: '',
    signers: 0,
    threshold: 0,
  });
  const wallets = useSelector(
    (state: GlobalStateType) => state.wallet.wallets,
  ).filter((wallet) => wallet.id === parseInt(props.walletId));
  const wallet = wallets.length > 0 ? wallets[0] : undefined;
  useEffect(() => {
    if (wallet) {
      if (
        stored.walletId !== `${props.walletId}` ||
        stored.xPubsJoined !== props.xPubs.sort().join('') ||
        stored.signers !== props.signers ||
        stored.threshold !== props.threshold
      ) {
        const xPubJoined = props.xPubs.sort().join('');
        const publicKeys: Array<string> = [...props.xPubs, wallet.xPub].map(
          (item) => {
            const item_b58 = getBase58ExtendedPublicKey(item);
            if (item_b58) {
              const pub = bip32.fromBase58(item_b58);
              const derived1 = pub.derive(0);
              return derived1.publicKey.toString('hex');
            }
            return '';
          },
        );
        const signers = props.signers;
        const threshold = props.threshold;
        const address = wallet
          ? generateMultiSigAddressFromPublicKeys(
              publicKeys,
              threshold,
              getChain(wallet.networkType).prefix,
              props.version,
            )
          : '';
        setStored({
          threshold: threshold,
          signers: signers,
          address: address,
          walletId: `${props.walletId}`,
          xPubsJoined: xPubJoined,
        });
      }
    }
  }, [
    stored.walletId,
    stored.xPubsJoined,
    stored.signers,
    stored.threshold,
    props.walletId,
    props.xPubs,
    props.signers,
    props.threshold,
    wallet,
    props.version,
  ]);
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mt: 1, p: 1 }}>
        This is your main address.
        <br />
        Please check it. if this is not your address you entered wrong signers
        public keys . double check it and try again
      </Typography>
      <Box>
        <Card sx={{ display: 'flex', bgcolor: 'info.light', p: 2 }}>
          <DisplayId id={stored.address} textAlign="center" />
          <CopyToClipboardIcon text={stored.address} />
        </Card>
      </Box>
      <Typography variant="subtitle2" sx={{ mt: 1, p: 1 }}>
        This is a multi-signature wallet. In order to send funds from it you
        need at least {props.threshold}&nbsp; signatures out of {props.signers}{' '}
        cosigning signatures.
      </Typography>
    </Box>
  );
};

export default AddressConfirmMultiSig;
