import React, { Fragment } from 'react';

import { Divider, Stack } from '@mui/material';

import SvgIcon from '@/icons/SvgIcon';

import LoadingPage from '../loading-page/LoadingPage';
import CenterMessage from '../state-message/CenterMessage';

interface ListControllerPropsType<T> {
  loading: boolean;
  error: boolean;
  data: Array<T>;
  errorTitle?: string;
  errorDescription?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  divider?: boolean;
  emptyIcon?: string;
  render: (item: T, index: number) => React.ReactNode;
}

const ListController = <T,>(props: ListControllerPropsType<T>) => {
  const displayList = props.data.length > 0 && !props.error && !props.loading;
  if (displayList) {
    return (
      <Stack
        divider={props.divider ? <Divider /> : null}
        spacing={props.divider ? 1 : 2}
      >
        {props.data.map((item, index) => (
          <Fragment key={index}>{props.render(item, index)}</Fragment>
        ))}
      </Stack>
    );
  }
  const title = props.loading
    ? 'Loading'
    : props.error
      ? props.errorTitle
      : props.emptyTitle;
  const description = props.loading
    ? 'Please Wait'
    : props.error
      ? props.errorDescription
      : props.emptyDescription;
  if (props.loading)
    return <LoadingPage description={description ?? ''} title={title} />;
  const icon = props.error ? (
    <SvgIcon icon="warning" color="error" style={{ marginBottom: -8 }} />
  ) : (
    <SvgIcon icon={props.emptyIcon ? props.emptyIcon : 'document'} />
  );
  return <CenterMessage icon={icon} description={description} title={title} />;
};

export default ListController;
