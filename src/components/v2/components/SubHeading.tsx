import { Typography } from '@mui/material';

interface PropsType {
  title: string;
  disableTopGutter?: boolean;
}

export default function ({ title, disableTopGutter }: PropsType) {
  return (
    <Typography
      variant="h3"
      color="textSecondary"
      mb={2}
      mt={disableTopGutter ? 0 : 2}
    >
      {title}
    </Typography>
  );
}
