import { ReactElement } from 'react';
import { Box, Typography, TypographyProps } from '@mui/material';

interface StateMessagePropsType {
  title: string;
  description?: string | Array<string>;
  icon?: ReactElement;
  color?: TypographyProps['color'];
  disableIconShadow?: boolean;
}

const StateMessage = (props: StateMessagePropsType) => {
  const getDescription = (): Array<string> => {
    if (props.description) {
      if (Array.isArray(props.description)) {
        return props.description;
      }
      return [props.description];
    }
    return [];
  };
  return (
    <Box>
      {props.icon && (
        <Box sx={{ textAlign: 'center', mb: 3, color: props.color }}>
          {props.icon}
          {!props.disableIconShadow && (
            <Box
              sx={{
                width: '100px',
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
      <Typography variant="h2" color={props.color} textAlign="center">
        {props.title}
      </Typography>
      {getDescription().map((row, index) => (
        <Typography
          variant="body2"
          color="textSecondary"
          textAlign="center"
          key={index}
        >
          {row}
        </Typography>
      ))}
    </Box>
  );
};

export default StateMessage;
