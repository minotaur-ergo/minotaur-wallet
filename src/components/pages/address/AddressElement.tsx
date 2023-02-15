import React from 'react';
import Erg from '../../value/Erg';
import { Badge, ListItem, ListItemText } from '@mui/material';
import DisplayId from '../../display-id/DisplayId';

interface PropsType {
  address: string;
  id: number;
  name: string;
  erg: bigint;
  handleClick: () => unknown;
  token_count: number;
  network_type: string;
}

const RenderName = (props: PropsType) => {
  return (
    <div>
      <div style={{ float: 'right' }}>
        <Erg
          erg={props.erg}
          showUnit={true}
          network_type={props.network_type}
        />
        <div>
          <div style={{ float: 'right', marginRight: 10 }}>
            {props.token_count ? (
              <Badge badgeContent={'+' + props.token_count} color="primary" />
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      {props.name}
    </div>
  );
};

const AddressElement = (props: PropsType) => {
  return (
    <ListItem onClick={props.handleClick}>
      <ListItemText
        disableTypography={true}
        primary={<RenderName {...props} />}
        secondary={<DisplayId color="gray" id={props.address} />}
      />
    </ListItem>
  );
};

export default AddressElement;
