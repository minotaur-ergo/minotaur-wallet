import ExtensionTheme from '../components/app-theme/ExtensionTheme';
import MinotaurLogo from '../components/splash/MinotaurLogo';
import { Typography } from '@mui/material';
import './extension.css';
const Extension = () => {
  return (
    <div className="container">
      <ExtensionTheme
        title="dApp Extension"
        navigation={<MinotaurLogo style={{ width: '40px' }} />}
      >
        <Typography>Salam</Typography>
        <Typography>Salam</Typography>
        <Typography>Salam</Typography>
        {/* <ListController
        ListItem={<ConnectedItem id="" name="" />}
        getData={getData}
        emptyTitle="You have no connected dApp yet"
        emptyDescription="You can connect a new dApp via scan the QR code."
        emptyIcon="document"
        divider={false}
      /> */}
      </ExtensionTheme>
    </div>
  );
};

export default Extension;
