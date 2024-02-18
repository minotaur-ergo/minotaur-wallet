import { Chip } from '@mui/material';

interface CustomChipPropsType {
  word: string;
  selected: boolean;
  handleSelect: () => unknown;
}

const CustomChip = (props: CustomChipPropsType) => {
  return (
    <Chip
      label={props.word}
      onClick={props.handleSelect}
      disabled={props.selected}
      variant="outlined"
      sx={{
        color: props.selected ? 'transparent' : 'unset',
        bgcolor: props.selected ? 'ddd' : '#c7ddff',
      }}
    />
  );
};

export default CustomChip;
