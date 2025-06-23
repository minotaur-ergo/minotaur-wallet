import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { StateWallet, GlobalStateType } from '@minotaur-ergo/types';

import { PinDbAction, WalletDbAction } from '@/action/db';
import SolitarySwitchField from '@/components/solitary/SolitarySwitchField';
import { honeyPinType } from '@/utils/convert';

interface DisplayInHoneyModePropsType {
  wallet: StateWallet;
}

const DisplayInHoneyMode = (props: DisplayInHoneyModePropsType) => {
  const [honeyModeEnabled, setHoneyModeEnabled] = useState<boolean>(false);
  const activeHoneyPin = honeyPinType(
    useSelector((state: GlobalStateType) => state.config.pin.activePinType),
  );
  useEffect(() => {
    PinDbAction.getInstance()
      .getAllPins()
      .then((pins) => {
        setHoneyModeEnabled(
          pins.filter((item) => item.type.startsWith(activeHoneyPin)).length >
            0,
        );
      });
  }, [activeHoneyPin]);
  const isHoneyMode =
    props.wallet.flags.filter((item) => item.startsWith(activeHoneyPin))
      .length > 0;
  const setDisplayInHoneyMode = async () => {
    if (isHoneyMode) {
      const honeyFlags = props.wallet.flags.filter((item) =>
        item.startsWith(activeHoneyPin),
      );
      for (const flag of honeyFlags) {
        await WalletDbAction.getInstance().setFlagOnWallet(
          props.wallet.id,
          flag,
          true,
        );
      }
    } else {
      await WalletDbAction.getInstance().setFlagOnWallet(
        props.wallet.id,
        activeHoneyPin,
        false,
      );
    }
  };
  if (!honeyModeEnabled) return null;
  return (
    <SolitarySwitchField
      label="Display wallet in honey mode"
      checkedDescription="Yes"
      uncheckedDescription="No"
      value={isHoneyMode}
      onChange={setDisplayInHoneyMode}
    />
  );
};

export default DisplayInHoneyMode;
