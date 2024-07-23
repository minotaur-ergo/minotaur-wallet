import { Avatar, Box, Card, Typography } from '@mui/material';
import DisplayId from '../../components/DisplayId';
import { AssetType } from '../../models';

export default function AssetCard({ amount, id, name, logoSrc }: AssetType) {
  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ float: 'left', mr: 2 }}>
        <Avatar alt={name} src={logoSrc || '/'} />
      </Box>
      <Box display="flex">
        <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
        <Typography>
          {amount.toFixed(2)} <small>ERG</small>
        </Typography>
      </Box>
      <DisplayId variant="body2" color="textSecondary" id={id} />
    </Card>
  );
}
