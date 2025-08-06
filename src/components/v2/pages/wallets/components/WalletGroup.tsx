import { Box, Card, CardActionArea, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRoute } from '../../../../route/routerMap';
import { RouterMap } from '../../../V2Demo';
import { ChevronRight } from '@mui/icons-material';
import { WalletType } from '../../../models';
import { WALLET_COLOR_MAP } from './WalletItem';

interface PropsType {
  id: string;
  name: string;
  amount: number;
  value: number;
  numberOfTokens: number;
  wallets: WalletType[];
}

const WALLET_GROUP_COLOR = '#FFE9B4';

export default function ({
  id,
  name,
  amount,
  value,
  numberOfTokens,
  wallets,
}: PropsType) {
  const navigate = useNavigate();

  return (
    <Box position="relative" mb={Math.min(3, wallets.length) * 0.75}>
      <Card>
        <CardActionArea
          onClick={() => navigate(getRoute(RouterMap.WalletsGroup, { id }))}
          sx={{
            bgcolor: WALLET_GROUP_COLOR,
            py: 2,
            pr: 2,
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Box flexGrow={1}>
            <Typography
              fontSize="1.25rem"
              fontWeight={500}
              lineHeight="1.5rem"
              sx={{ pl: 2, mb: 1 }}
            >
              {name}
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="end" gap={1}>
              <Box
                sx={{
                  bgcolor: '#ffffff8f',
                  px: 2,
                  py: 0.5,
                  borderTopRightRadius: 12,
                  borderBottomRightRadius: 12,
                }}
              >
                <Typography>
                  {amount.toFixed(2)} <small>ERG</small>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ${value.toFixed(2)}
                </Typography>
              </Box>
              <Box flexGrow={1}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  textAlign="right"
                >
                  {wallets.length} Wallet{wallets.length > 1 ? 's' : ''}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  textAlign="right"
                >
                  {numberOfTokens > 0
                    ? `${numberOfTokens} token${numberOfTokens > 1 ? 's' : ''}`
                    : 'No token'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <ChevronRight style={{ opacity: 0.6 }} />
        </CardActionArea>
        {wallets.slice(0, 3).map((wallet, index, array) => (
          <Card
            sx={{
              position: 'absolute',
              bottom: -6 * (array.length - index),
              left: 8 * (array.length - index),
              width: `calc(100% - ${16 * (array.length - index)}px)`,
              zIndex: -1,
              height: '100%',
              backgroundColor: WALLET_COLOR_MAP[wallet.type || 'Read Only'],
            }}
          />
        ))}
      </Card>
    </Box>
  );
}
