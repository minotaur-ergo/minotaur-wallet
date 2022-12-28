import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import { RouterMap } from '../../V2Demo';
import WorkspacesOutlinedIcon from '@mui/icons-material/WorkspacesOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SettingsBackupRestoreOutlinedIcon from '@mui/icons-material/SettingsBackupRestoreOutlined';

interface ItemCardPropsType {
  title: string;
  description?: string;
  path: string;
  icon: any;
}

const ItemCard = ({ title, description, path, icon }: ItemCardPropsType) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(path);
  return (
    <Card sx={{ position: 'relative' }}>
      <CardActionArea onClick={handleClick}>
        <CardHeader
          avatar={icon}
          title={title}
          sx={{
            pb: 0,
            color: 'primary.dark',
            '& .MuiCardHeader-title': { fontSize: '1.1rem' },
          }}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: -1,
          opacity: 0.1,
          transform: 'scale(7) translate(-10%, 15px)',
        }}
      >
        {icon}
      </Box>
    </Card>
  );
};

const AddWallet = () => {
  return (
    <AppFrame title="Add Wallet" navigation={<BackButton />}>
      <Stack spacing={2}>
        <ItemCard
          title="New wallet"
          description="Generate a random mnemonic and create a wallet with it. It can be a cold wallet or a normal wallet"
          path={RouterMap.CreateWallet}
          icon={<AddCircleOutlineOutlinedIcon />}
        />
        <ItemCard
          title="Restore wallet"
          description="Restore a wallet from an existing mnemonic. It can be a cold wallet or a normal wallet"
          path={RouterMap.RestoreWallet}
          icon={<SettingsBackupRestoreOutlinedIcon />}
        />
        <ItemCard
          title="Add read only wallet"
          description="Create a read-only wallet without storing any secret to track and create your transactions. It cannot sign any transaction and you need the corresponding cold wallet for signing."
          path={RouterMap.AddROWallet}
          icon={<VisibilityOutlinedIcon />}
        />
        <ItemCard
          title="Add multi sig wallet"
          description="New Multi-Signature Wallet Create a multi-signature wallet and manage your co-signing wallets."
          path={RouterMap.AddMSWallet}
          icon={<WorkspacesOutlinedIcon />}
        />
      </Stack>
    </AppFrame>
  );
};

export default AddWallet;
