import React from 'react';
import { Box, Card, CardActionArea, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRoute } from '../../../../route/routerMap';
import { RouterMap } from '../../../V2Demo';

interface PropsType {
  id: string;
  name: string;
  type?: string;
  net?: string;
  amount?: number;
  value?: number;
  index: number;
}

const COLORS = ['#fec844', '#f1592a', '#32b14a', '#4a9195', '#3c5152'];

export default function ({
  id,
  name,
  amount = 0,
  type = '',
  net = '',
  value = 0,
  index,
}: PropsType) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardActionArea
        onClick={() => navigate(getRoute(RouterMap.Home, { id }))}
        sx={{ bgcolor: COLORS[index % COLORS.length] + '70', display: 'flex' }}
      >
        <Box
          sx={{
            bgcolor: '#00000054',
            p: 1,
            my: 2,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <img
            src="/ergo.svg"
            style={{ width: '1.6rem', filter: 'invert(0.9)' }}
          />
        </Box>
        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Box display="flex" alignItems="baseline">
            <Typography
              sx={{ fontSize: '1.2rem', fontWeight: 500, flexGrow: 1 }}
            >
              {name}
            </Typography>
            <Typography>
              {amount.toFixed(2)} <small>ERG</small>
            </Typography>
          </Box>
          <Box display="flex">
            <Typography
              color="textSecondary"
              sx={{ fontSize: '0.7rem', flexGrow: 1 }}
            >
              {type} on {net}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem' }} color="textSecondary">
              ${value.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
