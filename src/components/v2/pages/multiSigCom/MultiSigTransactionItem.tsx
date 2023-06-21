import React, { useMemo } from 'react';
import { Box, Card, CardActionArea, Typography, useTheme } from '@mui/material';
import DisplayId from '../../components/DisplayId';
import { useNavigate } from 'react-router-dom';
import { RouterMap } from '../../V2Demo';

export default function ({ amount, id, stateId, step = 0, totalSteps }: any) {
  const navigate = useNavigate();
  const theme = useTheme();
  const handle_click = () =>
    navigate(RouterMap.MultiSigTrans.replace(':id', id));
  const state = useMemo(() => {
    switch (stateId) {
      case 'COMMITMENT':
        return {
          title: step === 0 ? 'Need to Commit' : 'Commitment',
          color: theme.palette.warning.dark,
        };
      case 'SIGNING':
        return {
          title: 'Signing',
          color: theme.palette.primary.dark,
        };
      case 'COMPLETED':
        return {
          title: 'Ready to Publish',
          color: theme.palette.success.dark,
        };
      default:
        return {};
    }
  }, [stateId]);

  return (
    <Card>
      <CardActionArea sx={{ p: 2 }} onClick={handle_click}>
        <Box display="flex" mb={1}>
          <Typography sx={{ flexGrow: 1, color: state.color }}>
            {state.title}
          </Typography>
          {totalSteps && (
            <Typography>
              {step} <small>/ {totalSteps}</small>
            </Typography>
          )}
        </Box>
        <Typography variant="body2" color="textSecondary">
          Total: {amount.toFixed(2)} <small>ERG</small>
        </Typography>
        <DisplayId variant="body2" color="textSecondary" id={id} />
      </CardActionArea>
    </Card>
  );
}
