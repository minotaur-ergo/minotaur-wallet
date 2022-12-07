import React from 'react';
import './DisplayId.css';
import { Typography } from '@mui/material';

const DisplayId = (props: {
  id: string | undefined;
  paddingSize?: number;
  color?: string;
}) => {
  const id = props.id ? props.id : '';
  const paddingSize = props.paddingSize ? props.paddingSize : 10;
  const dotStart = id.substring(0, paddingSize);
  const dottedEnd = id.substring(id.length - paddingSize);
  const dotted =
    id.length > 2 * paddingSize ? dotStart + '....' + dottedEnd : id;
  return <Typography color={props.color}>{dotted}</Typography>;
};

export default DisplayId;
