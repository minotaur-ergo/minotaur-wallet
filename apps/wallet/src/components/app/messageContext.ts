import { VariantType } from 'notistack';
import { createContext } from 'react';

interface MessageContextType {
  insert: (message: string, variant: VariantType) => unknown;
}

const MessageContext = createContext<MessageContextType>({
  insert: (message: string, variant: VariantType) => {
    console.log(message, variant);
  },
});

export default MessageContext;
