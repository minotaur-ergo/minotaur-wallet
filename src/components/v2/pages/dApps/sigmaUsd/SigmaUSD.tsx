import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';
import SigmaUsdPanel from './tabs/SigmaUsdPanel';
import SigmaRsvPanel from './tabs/SigmaRsvPanel';
import { IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import SigmaUsdHelp from './SigmaUsdHelp';

const SigmaUSD = () => {
  const [tab, setTab] = React.useState('usd');
  const [displayHelp, setDisplayHelp] = React.useState(false);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };
  const handleDisplayHelp = () => {
    setDisplayHelp(true);
  };
  const handleHideHelp = () => {
    setDisplayHelp(false);
  };

  return (
    <AppFrame
      title="SigmaUSD"
      navigation={<BackButton />}
      actions={
        <IconButton onClick={handleDisplayHelp}>
          <InfoIcon />
        </IconButton>
      }
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={handleChangeTab} variant="fullWidth">
          <Tab label="SigmaUSD" value="usd" />
          <Tab label="SigmaRSV" value="rsv" />
        </Tabs>
      </Box>
      {tab === 'usd' && <SigmaUsdPanel />}
      {tab === 'rsv' && <SigmaRsvPanel />}
      <SigmaUsdHelp open={displayHelp} handleClose={handleHideHelp} />
    </AppFrame>
  );
};

export default SigmaUSD;
