import { Typography } from '@mui/material';

import sx from './sx';

interface StringElementPropsType {
  data: string | number;
  component: 'span' | 'div';
}

const StringElement = (props: StringElementPropsType) => {
  return (
    <Typography component={props.component} sx={sx.value}>
      {props.data}
    </Typography>
  );
};

export default StringElement;
