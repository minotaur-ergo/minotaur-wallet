import { Chip, Box } from '@mui/material';

interface PropsType {
  mnemonic: string;
  hideIndex?: Array<number>;
  handleClick?: (index: number) => unknown;
}

const MnemonicView = (props: PropsType) => {
  const words = props.mnemonic ? props.mnemonic.split(' ') : [];
  const handleClick = (index: number) => {
    if (props.handleClick) {
      props.handleClick(index);
    }
  };
  const hideIndex = props.hideIndex ? props.hideIndex : [];
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
      {words.map((word, index) => (
        <Chip
          label={word}
          key={index}
          onClick={() => handleClick(index)}
          style={{ opacity: hideIndex.indexOf(index) === -1 ? 1 : 0 }}
        />
      ))}
    </Box>
  );
};

export default MnemonicView;
