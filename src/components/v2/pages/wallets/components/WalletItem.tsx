import {
  Box,
  Card,
  CardActionArea,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRoute } from '../../../../route/routerMap';
import { RouterMap } from '../../../V2Demo';
import SvgIcon from '../../../icons/SvgIcon';
import { StarBorder, Star } from '@mui/icons-material';
import { MouseEvent } from 'react';
import { WalletType } from '../../../models';

interface PropsType {
  id: string;
  name: string;
  type?: string;
  net?: string;
  amount?: number;
  value?: number;
  numberOfTokens?: number;
  favorite?: boolean;
  archived?: boolean;
  toggleFavorite: (id: string) => void;
}

export const WALLET_COLOR_MAP: Record<WalletType['type'], string> = {
  Normal: '#ADE0B7',
  'Multi-signature': '#F9BDAA',
  'Read Only': '#B7D3D5',
};

export default function ({
  id,
  name,
  amount = 0,
  type = '',
  net = '',
  value = 0,
  numberOfTokens = 0,
  favorite,
  archived,
  toggleFavorite,
}: PropsType) {
  const navigate = useNavigate();

  const color = WALLET_COLOR_MAP[type as WalletType['type']] || '#3c5152';

  const handleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <Card>
      <CardActionArea
        onClick={() => navigate(getRoute(RouterMap.Home, { id }))}
        sx={{
          bgcolor: color,
          pb: 2,
          pt: 1,
        }}
      >
        <Box px={2}>
          <Box display="flex" alignItems="start">
            <Typography
              fontSize="1.25rem"
              fontWeight={500}
              lineHeight="1.5rem"
              sx={{ flexGrow: 1, py: 1 }}
            >
              {name}
              {archived && <Chip label="Archived" sx={{ ml: 1 }} />}
            </Typography>
            <IconButton onClick={handleFavorite}>
              {favorite ? (
                <Star style={{ color: 'goldenrod' }} />
              ) : (
                <StarBorder />
              )}
            </IconButton>
          </Box>
          <Typography variant="body2" color="textSecondary">
            {numberOfTokens > 0
              ? `Includes ${numberOfTokens} token${
                  numberOfTokens > 1 ? 's' : ''
                }`
              : 'No token'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="end" gap={2} mt={1}>
          <Box
            sx={{
              bgcolor: '#ffffff8f',
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTopRightRadius: 12,
              borderBottomRightRadius: 12,
              fill: color,
            }}
          >
            <SvgIcon icon="ergo" style={{ width: '1.6rem', fill: 'inherit' }} />
          </Box>
          <Box flexGrow={1}>
            <Typography>
              {amount.toFixed(2)} <small>ERG</small>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ${value.toFixed(2)}
            </Typography>
          </Box>
          <Box mr={2}>
            <Typography
              variant="body2"
              fontSize="small"
              color="textSecondary"
              textAlign="right"
            >
              {net}
            </Typography>
            <Typography variant="body2" color="textSecondary" textAlign="right">
              {type}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
