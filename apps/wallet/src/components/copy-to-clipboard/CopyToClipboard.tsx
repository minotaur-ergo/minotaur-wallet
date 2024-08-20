import { useContext } from 'react';
import CopyToClipboardImpl from 'react-copy-to-clipboard';
import MessageContext from '../app/messageContext';

interface CopyToClipboardPropsType {
  text: string;
  showMessage?: boolean;
  callback?: () => unknown;
  children: React.ReactNode;
}

const CopyToClipboard = (props: CopyToClipboardPropsType) => {
  const message = useContext(MessageContext);
  const callback = () => {
    if (props.showMessage !== false) {
      message.insert('Copied', 'success');
    }
    if (props.callback) {
      props.callback();
    }
  };
  return (
    <CopyToClipboardImpl text={props.text} onCopy={callback}>
      {props.children}
    </CopyToClipboardImpl>
  );
};

export default CopyToClipboard;
