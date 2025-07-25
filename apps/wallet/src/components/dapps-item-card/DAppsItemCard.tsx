import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, Box, Card, CardActionArea, Typography } from '@mui/material';

interface ItemCardPropsType {
  title: string;
  description?: string;
  path: string;
  color: string;
  icon?: React.ReactNode;
}

const DAppsItemCard = (props: ItemCardPropsType) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(props.path);
  // return (
  //   <Card sx={{ p: 3 }}>
  //     <CardActionArea onClick={handleClick}>
  //       <Typography>{title}</Typography>
  //       <Typography variant="body2" color="textSecondary">
  //         {description}
  //       </Typography>
  //     </CardActionArea>
  //   </Card>
  // );
  return (
    <Card sx={{ height: '100%', boxSizing: 'border-box' }}>
      <CardActionArea
        onClick={handleClick}
        sx={{
          px: 3,
          pb: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'stretch',
        }}
      >
        <Box
          sx={{
            bgcolor: props.color,
            opacity: 0.5,
            pt: 2,
            pb: 1,
            mb: 2,
            borderRadius: '0 0 50% 50%/0 0 50% 50%',
          }}
        >
          <Avatar
            sx={{
              color: props.color,
              bgcolor: 'white',
              width: 56,
              height: 56,
              mx: 'auto',
            }}
          >
            {props.icon}
          </Avatar>
        </Box>
        <Typography textAlign="center" sx={{ mb: 1 }}>
          {props.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" textAlign="center">
          {props.description}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default DAppsItemCard;
