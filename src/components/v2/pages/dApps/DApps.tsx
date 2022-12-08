import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeFrame from '../../layouts/HomeFrame';
import { Card, CardActionArea, Stack, Typography } from '@mui/material';
import { RouterMap } from '../../V2Demo';

interface ItemCardPropsType {
  title: string;
  description?: string;
  path: string;
}

const ItemCard = ({ title, description, path }: ItemCardPropsType) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(path);
  return (
    <Card sx={{ p: 3 }}>
      <CardActionArea onClick={handleClick}>
        <Typography>{title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

const DApps = () => {
  return (
    <HomeFrame>
      <Stack spacing={3}>
        <ItemCard
          title="Issue Token"
          description="Issue new token using EIP-004"
          path={RouterMap.IssueToken}
        />
        <ItemCard
          title="SigmaUSD"
          description="Buy or sell SigmaUSD or SigmaRSV"
          path={RouterMap.SigmaUSD}
        />
      </Stack>
    </HomeFrame>
  );
};

export default DApps;
