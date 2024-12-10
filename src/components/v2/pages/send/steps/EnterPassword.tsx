import React from 'react';
import {
  Alert,
  Box,
  FormHelperText,
  Stack,
  Typography,
  TypographyProps,
} from '@mui/material';
import PasswordField from '../../../components/PasswordField';
import DisplayProperty from '../../../components/DisplayProperty';
import { TokenType } from '../../../models';
import DisplayToken from '../../../components/DisplayToken';

interface TokenItemPropsType extends TokenType {
  color?: 'primary' | 'success' | 'error';
}

function TextBox(props: TypographyProps) {
  return <Typography {...props} component="span" color="textPrimary" />;
}

export function TokenItem({ color, ...restProps }: TokenItemPropsType) {
  return (
    <Box display="flex" sx={{ gap: 1 }}>
      <Box
        sx={{
          width: 6,
          m: 0.5,
          borderRadius: 4,
          opacity: 0.5,
          bgcolor:
            color === 'success'
              ? 'success.light'
              : color === 'error'
              ? 'error.light'
              : 'primary.light',
        }}
      />
      <DisplayToken {...restProps} style={{ width: 'calc(100% - 22px)' }} />
    </Box>
  );
}

export default function () {
  return (
    <Box>
      <Typography variant="body2" color="textSecondary">
        Total spent
      </Typography>
      <Typography fontSize="large">
        {(3.0011).toFixed(2)}{' '}
        <Typography component="span" variant="body2" color="textSecondary">
          ERG
        </Typography>
      </Typography>
      <FormHelperText sx={{ mb: 2 }}>
        These amount will be spent when transaction proceed.
      </FormHelperText>

      <Typography variant="body2" color="textSecondary">
        Burning tokens
      </Typography>
      <Stack sx={{ mb: 2, mt: 1 }} gap={0.5}>
        <TokenItem
          name="Token 1"
          amount={10}
          id="1506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef"
          color="error"
        />
        <TokenItem
          name="Token 2"
          amount={5}
          id="1506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef"
          color="error"
        />
      </Stack>
      <Typography variant="body2" color="textSecondary">
        Issuing tokens
      </Typography>
      <Stack sx={{ mb: 2, mt: 1 }} gap={0.5}>
        <TokenItem
          name="Token 1"
          amount={3}
          id="1506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef"
          color="success"
        />
        <TokenItem
          name="Token 2"
          amount={24}
          id="1506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef"
          color="success"
        />
      </Stack>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 1, mt: 2 }}>
        Lorem ipsum
      </Typography>
      <Alert color="info" icon={false} sx={{ mb: 2 }}>
        <Stack spacing={1} component={TextBox}>
          <DisplayProperty label="Input Id" value={'input_id'} />
          <DisplayProperty label="Input Index" value={'input_index'} />
        </Stack>
      </Alert>

      <Alert color="info" icon={false} sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Data
        </Typography>
        <Typography color="textPrimary">
          {
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
          }
        </Typography>
      </Alert>

      <PasswordField
        label="Wallet Password"
        helperText="Enter your mnemonic passphrase to send transaction."
      />
    </Box>
  );
}
