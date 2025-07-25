import { ContentCopy } from '@mui/icons-material';

import CopyToClipboard from './CopyToClipboard';

interface CopyToClipboardIconPropsType {
  text: string;
  callback?: () => unknown;
  preventDefaultCallback?: boolean;
}

const CopyToClipboardIcon = (props: CopyToClipboardIconPropsType) => {
  return (
    <CopyToClipboard
      text={props.text}
      callback={props.callback}
      showMessage={!props.preventDefaultCallback}
    >
      <ContentCopy />
    </CopyToClipboard>
  );
};

export default CopyToClipboardIcon;
