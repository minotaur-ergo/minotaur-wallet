import React from 'react';

import { Box, Typography } from '@mui/material';

import sx from '@/components/display-json/sx';

import { Data, Renderer } from './type';

interface JsonElementPropsType {
  data: { [key: string]: Data };
  level: number;
  renderer: Renderer;
}

const JsonElement = (props: JsonElementPropsType) => {
  const Renderer = props.renderer;
  const data = Object.entries(props.data);
  return (
    <React.Fragment>
      {data.map(([key, value]) => (
        <Box key={key} sx={sx.row(props.level)}>
          <Typography component="span" sx={sx.key}>
            {key}:
          </Typography>
          <Renderer data={value} level={props.level + 1} />
        </Box>
      ))}
    </React.Fragment>
  );
};

export default JsonElement;
