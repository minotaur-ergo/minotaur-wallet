import { CheckCircleOutline, RadioButtonUnchecked } from '@mui/icons-material';
import { Box } from '@mui/material';


interface StatusBoxPropsTypes {
  value: string;
}

const StatusBox = (props: StatusBoxPropsTypes) => {
  const scanned = props.value !== '';
  return (
    <Box p={0} display="flex" color={scanned ? "success.light" : undefined}>
      {scanned ? <CheckCircleOutline fontSize="small"/> : <RadioButtonUnchecked fontSize="small"/>}
    </Box>
  );
}

export default StatusBox;
