import { createContext } from 'react';

import { VariantType } from 'notistack';

interface MessageContextType {
  insert: (message: string, variant: VariantType) => unknown;
}

const MessageContext = createContext<MessageContextType>({
  insert: (message: string, variant: VariantType) => {
    console.log(message, variant);
  },
});

export default MessageContext;
