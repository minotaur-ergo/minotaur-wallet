import { Box, CircularProgress } from '@mui/material';
import StateMessage from '../state-message/StateMessage';

interface LoadingPagePropsType {
  title?: string;
  description?: string;
}
const LoadingPage = (props: LoadingPagePropsType) => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <StateMessage
        title={props.title ? props.title : ''}
        description={props.description ? props.description : ''}
        icon={<CircularProgress />}
        disableIconShadow
      />
    </Box>
  );
};

export default LoadingPage;
