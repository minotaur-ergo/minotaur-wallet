import React from 'react';

import { Box } from '@mui/material';

import sx from './sx';
import { Data, Renderer } from './type';

interface ArrayElementPropsType {
  data: Array<Data>;
  renderer: Renderer;
  level: number;
}

const ArrayElement = (props: ArrayElementPropsType) => {
  const Renderer = props.renderer;
  return (
    <React.Fragment>
      {props.data.map((item, index) => (
        <Box key={index} sx={sx.arrayValue}>
          <Renderer data={item} key={index} level={props.level + 1} />
        </Box>
      ))}
    </React.Fragment>
  );
};

export default ArrayElement;
