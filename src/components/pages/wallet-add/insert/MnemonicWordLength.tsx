import React from 'react';
import { Slider } from '@mui/material';

interface MnemonicWordLengthPropsType {
  setValue: (value: number) => any;
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
      You can change mnemonic words. more mnemonic words, more security gained.
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
