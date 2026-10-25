import { useMemo } from 'react';

import {
  AddressCompletionState,
  MultiSigMyAction,
  StateWallet,
} from '@minotaur-ergo/types';

// signer is passed in, so it is the same value the page waits for
const useMyAction = (
  actions: Array<AddressCompletionState>,
  signer?: StateWallet,
): MultiSigMyAction => {
  // derived in render (not in an effect) so it always matches actions
  return useMemo(() => {
    const address = signer?.addresses[0]?.address;
    return {
      committed: actions.some(
        (item) => item.address === address && item.committed,
      ),
      signed: actions.some((item) => item.address === address && item.signed),
    };
  }, [actions, signer]);
};

export default useMyAction;
