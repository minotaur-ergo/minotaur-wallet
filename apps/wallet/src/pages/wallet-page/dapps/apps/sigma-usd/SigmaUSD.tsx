import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SigmaUsdPanel from './tabs/SigmaUsdPanel';
import SigmaRsvPanel from './tabs/SigmaRsvPanel';
import useBoxes from './useBoxes';
import { DAppPropsType } from '@minotaur-ergo/types';
import LoadingPage from '@/components/loading-page/LoadingPage';

const SigmaUSD = (props: DAppPropsType) => {
  const [tab, setTab] = React.useState('usd');
  const boxes = useBoxes(props.chain);

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };
  return (
    <React.Fragment>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={handleChangeTab} variant="fullWidth">
          <Tab label="SigmaUSD" value="usd" />
          <Tab label="SigmaRSV" value="rsv" />
        </Tabs>
      </Box>
      {boxes.bank && boxes.oracle ? (
        tab === 'usd' ? (
          <SigmaUsdPanel
            bank={boxes.bank}
            oracle={boxes.oracle}
            dappProps={props}
          />
        ) : (
          <SigmaRsvPanel
            bank={boxes.bank}
            oracle={boxes.oracle}
            dappProps={props}
          />
        )
      ) : (
        <LoadingPage />
      )}
    </React.Fragment>
  );
};

export default SigmaUSD;
