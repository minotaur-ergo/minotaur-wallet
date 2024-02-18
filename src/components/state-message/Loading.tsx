import AppFrame from '@/layouts/AppFrame';
import CenterMessage from './CenterMessage';
import { CircularProgress } from '@mui/material';

interface LoadingPropsType {
  title?: string;
  description?: Array<string>;
}

const Loading = (props: LoadingPropsType) => {
  return (
    <AppFrame title="">
      <CenterMessage
        icon={<CircularProgress />}
        description={props.description}
        title={props.title}
      />
    </AppFrame>
  );
};

export default Loading;
