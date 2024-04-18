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

const COLORS = ['#fec844', '#f1592a', '#32b14a', '#4a9195', '#3c5152'];

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

  const color = COLORS[Number(id.slice(-2)) % COLORS.length];

  const handleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <Card>
      <CardActionArea
        onClick={() => navigate(getRoute(RouterMap.Home, { id }))}
        sx={{
          bgcolor: color + '70',
          py: 2,
        }}
      >
        <Box px={2}>
          <Typography
            fontSize="1.2rem"
            fontWeight={500}
            lineHeight={1.2}
            mb={1}
          >
            {name}
            {archived && <Chip label="Archived" sx={{ ml: 1 }} />}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {type} on {net}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {numberOfTokens > 0
              ? `Includes ${numberOfTokens} token${
                  numberOfTokens > 1 ? 's' : ''
                }`
              : 'No token'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2} mt={2}>
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
            <Box display="flex" alignItems="baseline">
              <Typography sx={{ flexShrink: 0 }}>
                {amount.toFixed(2)} <small>ERG</small>
              </Typography>
            </Box>
            <Box display="flex">
              <Typography variant="body2" color="textSecondary">
                ${value.toFixed(2)}
              </Typography>
            </Box>
          </Box>
          <Box pr={1}>
            <IconButton onClick={handleFavorite}>
              {favorite ? (
                <Star style={{ color: 'goldenrod' }} />
              ) : (
                <StarBorder />
              )}
            </IconButton>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
