import React from 'react';
import { Slider } from '@mui/material';

interface MnemonicWordLengthPropsType {
  setValue: (value: number) => unknown;
  value: number;
}

const MnemonicWordLength = (props: MnemonicWordLengthPropsType) => {
  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      props.setValue(newValue);
    }
  };
  return (
    <React.Fragment>
      You can choose different mnemonic lengths. 24-words mnemonic is
      recommended. The more mnemonic words, the more secure.
      <Slider
        size="small"
        value={props.value}
        onChange={handleChange}
        min={12}
        max={24}
        step={3}
        marks
        aria-label="Small"
        valueLabelDisplay="auto"
      />
    </React.Fragment>
  );
};

export default MnemonicWordLength;
