import React from 'react';
import { Grid, Chip } from '@mui/material';
import './MnemonicView.css';

interface PropsType {
  mnemonic: string;
  hideIndex?: Array<number>;
  handleClick?: (index: number) => any;
}

const MnemonicView = (props: PropsType) => {
  const mnemonicList = props.mnemonic ? props.mnemonic.split(' ') : [];
  const handleClick = (index: number) => {
    if (props.handleClick) {
      props.handleClick(index);
    }
  };
  const hideIndex = props.hideIndex ? props.hideIndex : [];
  return (
    <Grid item xs={12}>
      {mnemonicList.map((item, index) => (
        <Chip
          key={index}
          onClick={() =>
            hideIndex.indexOf(index) < 0 ? handleClick(index) : null
          }
          label={item}
          className={
            hideIndex.indexOf(index) >= 0
              ? 'mnemonic-hide-chip'
              : 'mnemonic-chip'
          }
        />
      ))}
    </Grid>
  );
};

export default MnemonicView;
