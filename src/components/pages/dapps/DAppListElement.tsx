import React from 'react';
import { ListItem, ListItemText } from '@mui/material';

interface PropsType {
  name: string;
  description: string;
  icon?: string;
  url?: string;
  handleClick?: () => unknown;
}

const DAppListElement = (props: PropsType) => {
  return (
    <ListItem onClick={props.handleClick ? props.handleClick : () => null}>
      <ListItemText primary={props.name} secondary={props.description} />
    </ListItem>
  );
};

export default DAppListElement;
