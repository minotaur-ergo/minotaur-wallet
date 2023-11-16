import { useParams } from 'react-router-dom';
import AppFrame from '../../../layouts/AppFrame';
import { useMemo, useRef } from 'react';
import { WHITE_LIST } from '../../../data';
import BackButton from '../../../components/BackButton';
import { ListItemIcon, MenuItem } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ConfirmDrawer, {
  ConfirmDrawerHandle,
} from '../../../components/ConfirmDrawer';
import MoreMenu from '../../../components/MoreMenu';
import ConnectedDAppLog from './ConnectedDAppLog';

const ConnectedDApp = () => {
  const { dappid } = useParams();
  const removeConfirmDrawer = useRef<ConfirmDrawerHandle>(null);
  const dApp = useMemo(() => WHITE_LIST.find((i) => i.id === dappid), [dappid]);
  const logs = useMemo(() => dApp?.logs || [], [dApp]);

  const handle_remove = () => {
    removeConfirmDrawer.current?.open();
  };

  return (
    <AppFrame
      title={dApp?.name || ''}
      navigation={<BackButton />}
      actions={
        <MoreMenu>
          <MenuItem onClick={handle_remove}>
            <ListItemIcon>
              <DeleteOutlineOutlinedIcon />
            </ListItemIcon>
            Remove
          </MenuItem>
        </MoreMenu>
      }
    >
      {logs.map((item, index) => (
        <ConnectedDAppLog key={index} {...item} />
      ))}
      <ConfirmDrawer
        title="Remove connected dApp?"
        description="Lorem ipsum dolor sit amet, consectetur Ut enim ad minim veniam? dipiscing eliat quis nostrud exercitation."
        ref={removeConfirmDrawer}
      />
    </AppFrame>
  );
};

export default ConnectedDApp;
