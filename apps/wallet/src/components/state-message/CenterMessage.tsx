import { ReactElement } from 'react';

import { Box } from '@mui/material';

import StateMessage from './StateMessage';

interface CenterMessagePropsType {
  title?: string;
  description?: Array<string> | string;
  icon: ReactElement;
  disableIconShadow?: boolean;
  color?: string;
}
const CenterMessage = (props: CenterMessagePropsType) => {
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
        title={props.title || ''}
        description={props.description}
        icon={props.icon}
        color={props.color}
        disableIconShadow={props.disableIconShadow}
      />
    </Box>
  );
};

export default CenterMessage;
