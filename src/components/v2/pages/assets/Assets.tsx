import HomeFrame from '../../layouts/HomeFrame';
import ListController from '../../components/ListController';
import AssetItem from './AssetItem';
import { ListItemIcon, MenuItem } from '@mui/material';
import { FileDownloadOutlined, FileUploadOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { RouterMap } from '../../V2Demo';
import { ASSETS } from '../../data';

const Assets = () => {
  const navigate = useNavigate();
  const getAssets = () =>
    new Promise((resolve, reject) => {
      const x = Math.random();
      setTimeout(() => {
        if (x >= 0.3) resolve(ASSETS);
        else if (x >= 0.1) resolve([]);
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
    <HomeFrame
      extraItems={[
        <MenuItem
          onClick={() => navigate(RouterMap.ExportAsset)}
          key="export-asset"
        >
          <ListItemIcon>
            <FileUploadOutlined />
          </ListItemIcon>
          Export Asset
        </MenuItem>,
        <MenuItem key="import-asset">
          <ListItemIcon>
            <FileDownloadOutlined />
          </ListItemIcon>
          Import Asset
        </MenuItem>,
      ]}
    >
      <ListController
        ListItem={<AssetItem />}
        getData={getAssets}
        emptyTitle="You have no assets yet"
        emptyDescription="You can issue new asset using Issue Token dApp."
        emptyIcon="document"
        divider={false}
      />
    </HomeFrame>
  );
};

export default Assets;
