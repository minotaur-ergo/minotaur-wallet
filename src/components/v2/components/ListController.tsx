import React, { cloneElement, Fragment } from 'react';
import useList from '../reducers/useList';
import StateMessage from './StateMessage';
import { Box, Button, Divider, Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import SvgIcon from '../icons/SvgIcon';

interface PropsType {
  ListItem: JSX.Element;
  getData(): Promise<any>;
  emptyTitle: string;
  emptyDescription?: string;
  emptyIcon?: string | false;
  divider?: boolean;
}

export default function ({
  ListItem,
  getData,
  emptyDescription,
  emptyIcon,
  emptyTitle,
  divider = true,
}: PropsType) {
  const { data, isLoading, error, hasError, handleGetData } = useList(getData);

  if (isLoading)
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
          title={'Loading'}
          description={'Please wait'}
          icon={<CircularProgress />}
          disableIconShadow
        />
      </Box>
    );
  if (hasError)
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
          title={error.title}
          description={error.description}
          color="error.dark"
          icon={
            <SvgIcon
              icon="warning"
              color="error"
              style={{ marginBottom: -8 }}
            />
          }
        />
        <Button
          onClick={handleGetData}
          color="error"
          sx={{ mx: 'auto', mt: 6, width: '50%' }}
        >
          Retry
        </Button>
      </Box>
    );
  if (data.length === 0)
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
          title={emptyTitle}
          description={emptyDescription}
          icon={emptyIcon ? <SvgIcon icon={emptyIcon ?? 'document'} /> : false}
        />
      </Box>
    );
  return (
    <Stack divider={divider ? <Divider /> : null} spacing={divider ? 1 : 2}>
      {data.map((item, index) => (
        <Fragment key={index}>{cloneElement(ListItem, item)}</Fragment>
      ))}
    </Stack>
  );
}
