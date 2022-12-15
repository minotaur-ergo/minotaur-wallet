import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';
import SigmaUsdPanel from './tabs/SigmaUsdPanel';
import SigmaRsvPanel from './tabs/SigmaRsvPanel';

const SigmaUSD = () => {
  const [tab, setTab] = React.useState('usd');

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <AppFrame title="SigmaUSD" navigation={<BackButton />}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={handleChangeTab} variant="fullWidth">
          <Tab label="SigmaUSD" value="usd" />
          <Tab label="SigmaRSV" value="rsv" />
        </Tabs>
      </Box>
      {tab === 'usd' && <SigmaUsdPanel />}
      {tab === 'rsv' && <SigmaRsvPanel />}
    </AppFrame>
  );
};

export default SigmaUSD;
