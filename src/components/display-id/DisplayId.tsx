import React from 'react';
import './DisplayId.css';

const DisplayId = (props: { id: string | undefined; paddingSize?: number }) => {
  const paddingSize = props.paddingSize ? props.paddingSize : 10;
  const idStart = props.id
    ? props.id.substring(0, props.id.length - paddingSize)
    : '';
  const idEnd = props.id
    ? props.id.substring(props.id.length - paddingSize)
    : '';
  return (
    <React.Fragment>
      <span className="address-end">{idEnd}&nbsp;&nbsp;</span>
      <span className="truncate">{idStart}</span>
    </React.Fragment>
  );
};

export default DisplayId;
