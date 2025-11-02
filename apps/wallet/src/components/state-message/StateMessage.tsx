import { ReactElement } from 'react';

import { DescriptionType } from '@minotaur-ergo/types';
import { Box, Typography, TypographyProps } from '@mui/material';

interface StateMessagePropsType {
  title: string;
  description?: string | DescriptionType | Array<string | DescriptionType>;
  icon?: ReactElement;
  action?: ReactElement;
  color?: TypographyProps['color'];
  disableIconShadow?: boolean;
}

const StateMessage = (props: StateMessagePropsType) => {
  const getDescription = (): Array<string | DescriptionType> => {
    if (props.description) {
      if (Array.isArray(props.description)) {
        return props.description;
      }
      return [props.description];
    }
    return [];
  };
  return (
    <Box py={4} px={2}>
      {props.icon && (
        <Box sx={{ textAlign: 'center', mb: 2, color: props.color }}>
          {props.icon}
          {!props.disableIconShadow && (
            <Box
              sx={{
                width: '80px',
                height: '16px',
                borderRadius: '50%',
                bgcolor: props.color,
                mx: 'auto',
                opacity: 0.1,
              }}
            />
          )}
        </Box>
      )}
      <Typography color={props.color} textAlign="center">
        {props.title}
      </Typography>
      {getDescription().map((row, index) => (
        <Typography
          variant="body2"
          color={typeof row === 'string' ? 'textSecondary' : row.color}
          textAlign="center"
          key={index}
        >
          {typeof row === 'string' ? row : row.body}
        </Typography>
      ))}
      {props.action && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>{props.action}</Box>
      )}
    </Box>
  );
};

export default StateMessage;
