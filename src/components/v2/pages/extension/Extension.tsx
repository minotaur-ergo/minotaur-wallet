import MinotaurLogo from '../../../splash/MinotaurLogo';
import ExtensionFrame from './ExtensionFrame';
import ListController from '../../components/ListController';
import ConnectedItem from '../dApps/whiteList/ConnectedItem';
import { WHITE_LIST } from '../../data';

export default function Extension() {
  const getData = () =>
    new Promise((resolve, reject) => {
      resolve(WHITE_LIST);
    });

  return (
    <ExtensionFrame
      title="dApp Extension"
      navigation={<MinotaurLogo style={{ width: '40px' }} />}
    >
      <ListController
        ListItem={<ConnectedItem id="" name="" />}
        getData={getData}
        emptyTitle="You have no connected dApp yet"
        emptyDescription="You can connect a new dApp via scan the QR code."
        emptyIcon="document"
        divider={false}
      />
    </ExtensionFrame>
  );
}
