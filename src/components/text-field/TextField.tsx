import MuiTextField, { TextFieldProps } from '@mui/material/TextField';

const TextField = (props: Omit<TextFieldProps, 'autoComplete'>) => (
  <MuiTextField {...props} autoComplete="off" />
);

export default TextField;
