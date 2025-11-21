import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType, SymbolType } from '@minotaur-ergo/types';
import {
  getLast12MonthNames,
  getWeeklyDateLabels,
} from '@minotaur-ergo/utils/src/date';
import { ArrowDropDown } from '@mui/icons-material';
import { Box, FormControl, MenuItem, Select } from '@mui/material';
import { LineChart } from '@mui/x-charts';

interface BalanceChartProps {
  walletId: number;
}

const avg = (arr: number[]) =>
  arr.length === 0 ? 0 : arr.reduce((s, n) => s + n, 0) / arr.length;

const BalanceChart = ({ walletId }: BalanceChartProps) => {
  const symbol: SymbolType = useSelector(
    (state: GlobalStateType) => state.config.symbol,
  );
  const currency = useSelector(
    (state: GlobalStateType) => state.config.currency,
  );
  const history = useSelector(
    (state: GlobalStateType) => state.wallet.balanceHistory[walletId],
  );
  const [mode, setMode] = useState('monthly');

  const monthlyData = useMemo(() => {
    if (!history) return { data: [], xAxis: [] };

    const daysPerMonth = 30;
    const start = new Date().getDate();
    const data: number[] = [];
    const xAxis = getLast12MonthNames();

    for (let i = start; i < history.length; i += daysPerMonth) {
      data.push(avg(history.slice(i, i + daysPerMonth)));
    }

    return { data, xAxis };
  }, [history]);

  const weeklyData = useMemo(() => {
    if (!history) return { data: [], xAxis: [] };

    const daysPerWeek = 7;
    const start = new Date().getDay();
    const data: number[] = [];

    for (let i = start; i < history.length; i += daysPerWeek) {
      data.push(avg(history.slice(i, i + daysPerWeek)));
    }

    const xAxis = getWeeklyDateLabels(data.length);
    return { data, xAxis };
  }, [history]);

  const { data, xAxis } = mode === 'monthly' ? monthlyData : weeklyData;

  return (
    <>
      <LineChart
        xAxis={[
          {
            data: xAxis,
            scaleType: 'band',
            height: mode === 'monthly' ? 40 : 60,
            tickLabelStyle: { angle: -90 },
          },
        ]}
        series={[
          {
            data: data,
            label: `${currency} (${symbol.symbol})`,
          },
        ]}
        height={200}
        margin={{ bottom: 20 }}
      />

      <Box display="flex" justifyContent="center" sx={{ width: '100%' }}>
        <FormControl
          sx={{
            width: { xs: 120, sm: 140, md: 160 },
            margin: 1,
            borderRadius: 1,
            backgroundColor: '#ffffff',
          }}
        >
          <Select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            variant="outlined"
            IconComponent={ArrowDropDown}
            sx={{
              'minHeight': 36,
              'textAlign': 'center',
              'borderRadius': 100,
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiSelect-select': {
                textAlign: 'center',
                paddingY: '6px',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  'borderRadius': 2,
                  '& .MuiMenuItem-root': {
                    'justifyContent': 'center',
                    'textAlign': 'center',
                    'borderRadius': 2,
                    '&:hover': { backgroundColor: '#f0f0f0' },
                  },
                },
              },
            }}
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

export default BalanceChart;
