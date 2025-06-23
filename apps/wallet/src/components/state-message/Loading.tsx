import { CircularProgress } from '@mui/material';

import AppFrame from '@/layouts/AppFrame';

import CenterMessage from './CenterMessage';

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
