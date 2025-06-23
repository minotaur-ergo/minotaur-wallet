import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import OutboxOutlinedIcon from '@mui/icons-material/OutboxOutlined';
import WidgetsIcon from '@mui/icons-material/Widgets';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import { Box, Button, Grid, IconButton, SvgIcon, styled } from '@mui/material';

import { RouteMap, getRoute } from '@/router/routerMap';

const RootBox = styled(Box)(
  () => `
  position: relative;
  & .content {
    display: flex;
    justify-content: space-around;
  }
  & .toolbar-frame {
    position: absolute;
    width: 100%;
    height: 100%;
    filter: drop-shadow(0px 4px 6px #00000088);
    display: flex;
    flex-direction: row;
    & div {
      background-color: #fff;
    }
  }
`,
);

interface ButtonPropsType {
  label: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  icon: any;
  activeIcon: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  path: string;
}

const ToolbarButton = ({ label, icon, activeIcon, path }: ButtonPropsType) => {
  const location = useLocation();
  const navigate = useNavigate();
  const active = useMemo(
    () => location.pathname === path,
    [location.pathname, path],
  );

  return (
    <Button
      variant="text"
      sx={{
        'flexDirection': 'column',
        'fontSize': '0.7rem',
        '&:not(.active)': {
          color: '#727272',
        },
      }}
      className={active ? 'active' : ''}
      fullWidth={false}
      onClick={() => navigate(path, { replace: true })}
    >
      <SvgIcon
        component={active ? activeIcon : icon}
        sx={{ fontSize: '1.8rem' }}
      />
      {label}
    </Button>
  );
};

interface AppToolbarPropsType {
  id: number;
}

const AppToolbar = (props: AppToolbarPropsType) => {
  const navigate = useNavigate();
  return (
    <RootBox>
      <Box className="toolbar-frame">
        <Box flexGrow={1} sx={{ borderTopRightRadius: 24 }} />
        <Box flexBasis={36} sx={{ marginTop: 3 }} />
        <Box flexGrow={1} sx={{ borderTopLeftRadius: 24 }} />
      </Box>

      <Grid
        container
        columns={5}
        sx={{ '& .MuiGrid-item': { textAlign: 'center' } }}
      >
        <Grid item xs={1}>
          <ToolbarButton
            label="Home"
            path={getRoute(RouteMap.WalletHome, { id: props.id })}
            icon={HomeOutlinedIcon}
            activeIcon={HomeIcon}
          />
        </Grid>
        <Grid item xs={1}>
          <ToolbarButton
            label="Address"
            path={getRoute(RouteMap.WalletAddress, { id: props.id })}
            icon={CreditCardOutlinedIcon}
            activeIcon={CreditCardIcon}
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton
            size="large"
            sx={{
              'color': 'white',
              'bgcolor': 'primary.dark',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
            onClick={() =>
              navigate(getRoute(RouteMap.WalletSend, { id: props.id }))
            }
          >
            <OutboxOutlinedIcon sx={{ fontSize: '1.8rem' }} />
          </IconButton>
        </Grid>
        <Grid item xs={1}>
          <ToolbarButton
            label="Assets"
            path={getRoute(RouteMap.WalletAsset, { id: props.id })}
            icon={BusinessCenterOutlinedIcon}
            activeIcon={BusinessCenterIcon}
          />
        </Grid>
        <Grid item xs={1}>
          <ToolbarButton
            label="dApps"
            path={getRoute(RouteMap.WalletDApps, { id: props.id })}
            icon={WidgetsOutlinedIcon}
            activeIcon={WidgetsIcon}
          />
        </Grid>
      </Grid>
    </RootBox>
  );
};

export default AppToolbar;
