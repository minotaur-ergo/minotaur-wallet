import { Typography } from '@mui/material';

import sx from './sx';

interface StringElementPropsType {
  data: boolean;
  component: 'span' | 'div';
}

const StringElement = (props: StringElementPropsType) => {
  return (
    <Typography component={props.component} sx={sx.value}>
      {props.data ? 'True' : 'False'}
    </Typography>
  );
};

export default StringElement;
