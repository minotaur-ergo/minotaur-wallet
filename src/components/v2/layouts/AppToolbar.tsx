import React, { useMemo } from 'react';
import { Box, Button, IconButton, SvgIcon, styled, Grid } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import WidgetsIcon from '@mui/icons-material/Widgets';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import OutboxOutlinedIcon from '@mui/icons-material/OutboxOutlined';
import { RouterMap } from '../V2Demo';
import { useLocation, useNavigate } from 'react-router-dom';

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
  }
`
);

interface ButtonPropsType {
  label: string;
  icon: any;
  activeIcon: any;
  path: string;
}

const ToolbarButton = ({ label, icon, activeIcon, path }: ButtonPropsType) => {
  const location = useLocation();
  const navigate = useNavigate();
  const active = useMemo(() => location.pathname === path, []);

  return (
    <Button
      variant="text"
      sx={{
        flexDirection: 'column',
        fontSize: '0.7rem',
        '&:not(.active)': {
          color: '#727272',
        },
      }}
      className={active ? 'active' : ''}
      fullWidth={false}
      onClick={() => navigate(path)}
    >
      <SvgIcon
        component={active ? activeIcon : icon}
        sx={{ fontSize: '1.8rem' }}
      />
      {label}
    </Button>
  );
};

const AppToolbar = () => {
  return (
    <RootBox>
      <Box className="toolbar-frame">
        <svg viewBox="0 0 100 20">
          <defs>
            <mask id="cut">
              <rect x="0" y="0" width="100" height="20" fill="#fff" />
              <path d="M38,0 Q45,0 45,10 L55,10 Q55,0 62,0 Z" fill="#000" />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100"
            height="20"
            fill="#fff"
            mask="url(#cut)"
          />
        </svg>
      </Box>

      <Grid
        container
        columns={5}
        sx={{ '& .MuiGrid-item': { textAlign: 'center' } }}
      >
        <Grid item xs={1}>
          <ToolbarButton
            label="Home"
            path={RouterMap.Home}
            icon={HomeOutlinedIcon}
            activeIcon={HomeIcon}
          />
        </Grid>
        <Grid item xs={1}>
          <ToolbarButton
            label="Addresses"
            path={RouterMap.Addresses}
            icon={CreditCardOutlinedIcon}
            activeIcon={CreditCardIcon}
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton
            size="large"
            sx={{
              color: 'white',
              bgcolor: 'primary.dark',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <OutboxOutlinedIcon sx={{ fontSize: '1.8rem' }} />
          </IconButton>
        </Grid>
        <Grid item xs={1}>
          <ToolbarButton
            label="Assets"
            path={RouterMap.Assets}
            icon={BusinessCenterOutlinedIcon}
            activeIcon={BusinessCenterIcon}
          />
        </Grid>
        <Grid item xs={1}>
          <ToolbarButton
            label="dApps"
            path={RouterMap.DApps}
            icon={WidgetsOutlinedIcon}
            activeIcon={WidgetsIcon}
          />
        </Grid>
      </Grid>
    </RootBox>
  );
};

export default AppToolbar;
