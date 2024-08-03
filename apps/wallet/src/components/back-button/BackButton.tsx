import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { IconButton } from '@mui/material';

interface PropsType {
  onClick(): void;
}

const BackButton = (props: PropsType) => {
  return (
    <IconButton onClick={props.onClick}>
      <ChevronLeftIcon />
    </IconButton>
  );
};

export default BackButton;
