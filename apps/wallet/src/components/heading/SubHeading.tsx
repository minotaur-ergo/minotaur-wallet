import { Typography } from '@mui/material';

interface SubHeadingPropsType {
  title: string;
  disableTopGutter?: boolean;
}

const SubHeading = (props: SubHeadingPropsType) => {
  return (
    <Typography
      variant="h3"
      color="textSecondary"
      mb={2}
      mt={props.disableTopGutter ? 0 : 2}
    >
      {props.title}
    </Typography>
  );
};

export default SubHeading;
