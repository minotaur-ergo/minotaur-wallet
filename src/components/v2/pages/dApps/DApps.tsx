import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeFrame from '../../layouts/HomeFrame';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Grid,
  Typography,
  TypographyProps,
} from '@mui/material';
import { RouterMap } from '../../V2Demo';
import TokenTwoToneIcon from '@mui/icons-material/TokenTwoTone';
import BalanceTwoToneIcon from '@mui/icons-material/BalanceTwoTone';
import LocalFireDepartmentTwoToneIcon from '@mui/icons-material/LocalFireDepartmentTwoTone';
import { BuildCircleTwoTone } from '@mui/icons-material';

interface ItemCardPropsType {
  title: string;
  description?: string;
  path: string;
  icon?: ReactNode;
  color?: TypographyProps['color'];
}

const ItemCardA = ({
  title,
  description,
  path,
  icon,
  color = 'primary.main',
}: ItemCardPropsType) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(path);
  return (
    <Card sx={{ height: '100%', boxSizing: 'border-box' }}>
      <CardActionArea
        onClick={handleClick}
        sx={{
          px: 3,
          pb: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'stretch',
        }}
      >
        <Box
          sx={{
            bgcolor: color,
            opacity: 0.5,
            pt: 2,
            pb: 1,
            mb: 2,
            borderRadius: '0 0 50% 50%/0 0 50% 50%',
          }}
        >
          <Avatar
            sx={{
              color: color,
              bgcolor: 'white',
              width: 56,
              height: 56,
              mx: 'auto',
            }}
          >
            {icon}
          </Avatar>
        </Box>
        <Typography textAlign="center" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" textAlign="center">
          {description}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

const ItemCardB = ({ title, description, path }: ItemCardPropsType) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(path);
  return (
    <Card sx={{ p: 3 }}>
      <CardActionArea onClick={handleClick}>
        <Typography>{title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

const DApps = () => {
  return (
    <HomeFrame>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ItemCardB
            title="White List"
            description="Manage connected dApps"
            path={RouterMap.WhiteList}
          />
        </Grid>
        <Grid item xs={6}>
          <ItemCardA
            title="Issue Token"
            description="Issue new token using EIP-004"
            path={RouterMap.IssueToken}
            icon={<TokenTwoToneIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={6}>
          <ItemCardA
            title="SigmaUSD"
            description="Buy or sell SigmaUSD or SigmaRSV"
            path={RouterMap.SigmaUSD}
            icon={<BalanceTwoToneIcon fontSize="large" />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={6}>
          <ItemCardA
            title="Burn Token"
            description="Buy or sell SigmaUSD or SigmaRSV"
            path={RouterMap.SigmaUSD}
            icon={<LocalFireDepartmentTwoToneIcon fontSize="large" />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={6}>
          <ItemCardA
            title="Box Consolidation"
            description="Renew unspent boxes"
            path={RouterMap.BoxConsolidation}
            icon={<BuildCircleTwoTone fontSize="large" />}
            color="success.main"
          />
        </Grid>
      </Grid>
    </HomeFrame>
  );
};

export default DApps;
