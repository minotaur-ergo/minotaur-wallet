import BackButton from '@/components/back-button/BackButton';
import StateMessage from '@/components/state-message/StateMessage';
import AppFrame from '@/layouts/AppFrame';
import { QrCodeTypeEnum } from '@/types/qrcode';
import { Button } from '@mui/material';
import SvgIcon from '@/icons/SvgIcon';
import { useContext } from 'react';
import { QrCodeContext } from '../../QrCodeContext';

interface MorePagesPropsType {
  error: string;
  type?: QrCodeTypeEnum;
  completed: number;
  total: number;
  close: () => unknown;
}

const MorePages = (props: MorePagesPropsType) => {
  const context = useContext(QrCodeContext);
  const scan = () => {
    context.start();
  };
  return (
    <AppFrame
      title="More Pages are required"
      navigation={<BackButton onClick={props.close} />}
      toolbar={
        props.error ? (
          <Button onClick={scan} color="error" sx={{ mx: 'auto', mt: 6 }}>
            Scan Again
          </Button>
        ) : (
          <Button onClick={scan}>Scan Next Page</Button>
        )
      }
    >
      {props.error !== '' ? (
        <StateMessage
          title=""
          description={props.error}
          icon={
            <SvgIcon icon="error" color="error" style={{ marginBottom: -8 }} />
          }
          color="error.dark"
        />
      ) : (
        <StateMessage
          title="More Pages Needed"
          description={`You scanned ${props.completed} of ${props.total} pages`}
          icon={
            <SvgIcon icon="info" color="info" style={{ marginBottom: -8 }} />
          }
          color="info.dark"
        />
      )}
    </AppFrame>
  );
};

export default MorePages;
