import React, { useMemo, useState } from 'react';

import { dottedText, getValueColor } from '@minotaur-ergo/utils';
import {
  AddBoxOutlined,
  LocalFireDepartment,
  MoveToInbox,
  Outbox,
} from '@mui/icons-material';
import { Avatar, Box, Chip, ListItem, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';

import TokenAmountDisplay from '@/components/amounts-display/TokenAmountDisplay';
import useAssetDetail from '@/hooks/useAssetDetail';
import AssetItemDetail from '@/pages/wallet-page/asset/AssetItemDetail';

interface TxAssetDetailPropsType {
  id: string;
  amount: bigint;
  networkType: string;
  issueAndBurn?: boolean;
}
const TxAssetDetail = (props: TxAssetDetailPropsType) => {
  const details = useAssetDetail(props.id, props.networkType);
  const [showDetail, setShowDetail] = useState(false);
  const status = useMemo(() => {
    const isPositive = props.amount > 0n;
    if (isPositive && props.issueAndBurn) {
      return {
        label: 'Issued',
        icon: AddBoxOutlined,
        chipColor: '#D4ECDD',
        textColor: '#1E7A45',
      };
    }
    if (isPositive && !props.issueAndBurn) {
      return {
        label: 'Received',
        icon: MoveToInbox,
        chipColor: '#D4ECDD',
        textColor: '#1E7A45',
      };
    }
    if (!isPositive && props.issueAndBurn) {
      return {
        label: 'Burnt',
        icon: LocalFireDepartment,
        chipColor: '#F0DBDB',
        textColor: '#C62828',
      };
    }
    return {
      label: 'Sent',
      icon: Outbox,
      chipColor: '#F0DBDB',
      textColor: '#C62828',
    };
  }, [props.amount, props.issueAndBurn]);
  if (props.amount === 0n) return null;
  const color = getValueColor(props.amount);
  const StatusIcon = status.icon;
  return (
    <React.Fragment>
      <ListItem
        disableGutters
        disablePadding
        onClick={() => setShowDetail(true)}
        sx={{
          mt: 1,
          py: 1,
          px: 0.5,
          borderRadius: 1,
          cursor: 'pointer',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
          }}
        >
          <Avatar
            alt={details.name}
            src={details.logoPath ?? '/'}
            sx={{ width: 36, height: 36, bgcolor: '#BDBDBD' }}
          >
            {details.name?.[0] ?? 'T'}
          </Avatar>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 500,
                lineHeight: '22px',
                color: 'text.primary',
              }}
            >
              {details.name}
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 12,
                lineHeight: '16px',
                color: '#616161',
              }}
            >
              {dottedText(props.id, 10)}
            </Typography>
            <Chip
              icon={<StatusIcon sx={{ fontSize: 14 }} />}
              label={status.label}
              size="small"
              sx={{
                'mt': 0.75,
                'height': 22,
                'borderRadius': '4px',
                'bgcolor': status.chipColor,
                'color': status.textColor,
                '& .MuiChip-icon': { color: 'inherit', ml: 0.75, mr: -0.5 },
                '& .MuiChip-label': {
                  px: 1,
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: '16px',
                },
              }}
            />
          </Box>

          <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 500,
                lineHeight: '22px',
                color,
              }}
            >
              <TokenAmountDisplay
                amount={props.amount}
                decimal={details.decimal}
                tokenId={props.id}
                showMonetaryValue={true}
              />
            </Typography>
          </Box>
        </Box>
      </ListItem>
      <Drawer
        anchor="bottom"
        open={showDetail}
        onClose={() => setShowDetail(false)}
      >
        <AssetItemDetail
          id={props.id}
          network_type={props.networkType}
          handleClose={() => setShowDetail(false)}
        />
      </Drawer>
    </React.Fragment>
  );
};

export default TxAssetDetail;
