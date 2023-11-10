import { IconButton } from '@mui/material';
import BackButton from '../../../components/BackButton';
import ListController from '../../../components/ListController';
import { WHITE_LIST } from '../../../data';
import AppFrame from '../../../layouts/AppFrame';
import ConnectedItem from './ConnectedItem';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useNavigate } from 'react-router-dom';
import { RouterMap } from '../../../V2Demo';

const WhiteList = () => {
  const navigate = useNavigate();

  const getData = () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const x = Math.random();
        if (x >= 0.4) resolve(WHITE_LIST);
        else if (x >= 0.2) resolve([]);
        else
          reject([
            {
              title: 'Unknown error',
              description: 'Please try again',
            },
          ]);
      }, 1000);
    });

  return (
    <AppFrame
      title="White List"
      navigation={<BackButton />}
      actions={
        <IconButton onClick={() => navigate(RouterMap.Scan)}>
          <QrCodeScannerIcon />
        </IconButton>
      }
    >
      <ListController
        ListItem={<ConnectedItem id="" name="" />}
        getData={getData}
        emptyTitle="You have no connected dApp yet"
        emptyDescription="You can connect a new dApp via scan the QR code."
        emptyIcon="document"
        divider={false}
      />
    </AppFrame>
  );
};

export default WhiteList;
