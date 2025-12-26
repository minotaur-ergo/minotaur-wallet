import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType } from '@minotaur-ergo/types';
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
  const history = useSelector(
    (state: GlobalStateType) => state.wallet.balanceHistory[walletId],
  );
  const [loading, showChart] = useSelector((state: GlobalStateType) => [
    state.wallet.loadingBalanceHistory,
    state.wallet.showBalanceChart,
  ]);
  const [mode, setMode] = useState('monthly');
  const [hideChart, setHideChart] = useState(false);

  const monthlyData = useMemo(() => {
    if (!history) return { data: [], xAxis: [] };

    const daysPerMonth = 30;
    const start = new Date().getDate();
    const data: number[] = [];
    const xAxis = getLast12MonthNames();

    for (let i = start; i < history.length; i += daysPerMonth) {
      if (data.length === xAxis.length) {
        break;
      }
      const balance = avg(history.slice(i, i + daysPerMonth));
      if (balance < 0) {
        setHideChart(true);
      }
      data.push(balance);
    }

    return { data, xAxis };
  }, [history]);

  const weeklyData = useMemo(() => {
    if (!history) return { data: [], xAxis: [] };

    const daysPerWeek = 7;
    const start = new Date().getDay();
    const data: number[] = [];
    const xAxis = getWeeklyDateLabels(48);

    for (let i = start; i < history.length; i += daysPerWeek) {
      if (data.length === xAxis.length) {
        break;
      }
      const balance = avg(history.slice(i, i + daysPerWeek));
      if (balance < 0) {
        setHideChart(true);
      }
      data.push(balance);
    }

    return { data, xAxis };
  }, [history]);

  const { data, xAxis } = mode === 'monthly' ? monthlyData : weeklyData;

  return showChart && !hideChart ? (
    <>
      <Box display="flex" justifyContent="center" sx={{ width: '100%' }}>
        <FormControl
          sx={{
            position: 'absolute',
            right: 0,
            bottom: '56%',
            color: '#00000066',
            backgroundColor: '#FFFFFF7E',
            borderBottomLeftRadius: 20,
            borderTopLeftRadius: 20,
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
            p: 0.5,
          }}
          fullWidth={false}
        >
          <Select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            variant="outlined"
            IconComponent={ArrowDropDown}
            sx={{
              'minHeight': 20,
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
                  'borderRadius': 1,
                  'marginTop': 0.8,
                  'padding': '0px 8px',
                  '& .MuiMenuItem-root': {
                    'justifyContent': 'center',
                    'textAlign': 'center',
                    'borderRadius': 1,
                    '&:hover': { backgroundColor: '#FFFFFF7E' },
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

      <LineChart
        loading={loading}
        xAxis={[
          {
            data: xAxis,
            scaleType: 'point',
            height: mode === 'monthly' ? 40 : 60,
            tickLabelStyle: {
              angle: -45,
              fill: '#576574',
            },
            disableTicks: true,
          },
        ]}
        disableAxisListener={true}
        series={[
          {
            data: data,
            area: true,
            showMark: false,
          },
        ]}
        grid={{
          horizontal: true,
        }}
        colors={['rgba(243, 156, 18,0.6)']}
        axisHighlight={{ x: 'none', y: 'none' }}
        yAxis={[
          {
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: {
              fill: '#576574',
              transform: 'translate(2.5rem, -0.5rem)',
            },
            tickLabelInterval: (_value, index: number) => {
              if (index == 0) return false;
              return true;
            },
          },
        ]}
        height={200}
        margin={{
          bottom: 0,
          right: 16,
          left: -28,
          top: 0,
        }}
        sx={{
          'transform': 'translateY(-20px)',
          '.MuiChartsAxis-root .MuiChartsAxis-line': {
            stroke: 'rgba(0, 0, 0, 0.12)',
          },
        }}
      />
    </>
  ) : null;
};

export default BalanceChart;
