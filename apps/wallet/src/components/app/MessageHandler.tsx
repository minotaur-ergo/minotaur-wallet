import React from 'react';

import { enqueueSnackbar, SnackbarProvider, VariantType } from 'notistack';

import CloseAction from './CloseAction';
import MessageContext from './messageContext';

interface MessageHandlerPropsType {
  children?: React.ReactNode;
}

const MessageHandler = (props: MessageHandlerPropsType) => {
  const insert = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, {
      variant: variant,
      autoHideDuration: 3000,
      style: { whiteSpace: 'pre-line' },
    });
  };
  return (
    <SnackbarProvider
      style={{ zIndex: 9999 }}
      maxSnack={10}
      action={(key) => <CloseAction msgKey={key} />}
    >
      <MessageContext.Provider value={{ insert }}>
        {props.children}
      </MessageContext.Provider>
    </SnackbarProvider>
  );
};

export default MessageHandler;
