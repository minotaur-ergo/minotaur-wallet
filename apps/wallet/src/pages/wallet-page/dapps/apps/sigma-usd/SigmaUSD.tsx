import React from 'react';

import { DAppPropsType } from '@minotaur-ergo/types';
import { Box, Tab, Tabs } from '@mui/material';

import LoadingPage from '@/components/loading-page/LoadingPage';

import SigmaRsvPanel from './tabs/SigmaRsvPanel';
import SigmaUsdPanel from './tabs/SigmaUsdPanel';
import useBoxes from './useBoxes';

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
