import { Fragment, cloneElement, useMemo } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonProps,
  Card,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import DisplayId from '../../../components/DisplayId';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import CreditCardOffOutlinedIcon from '@mui/icons-material/CreditCardOffOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import DisplayProperty from '../../../components/DisplayProperty';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';

export enum DAppActions {
  REQUEST_ACCESS = 'REQUEST_ACCESS',
  CHECK_ACCESS = 'CHECK_ACCESS',
  UTXOS = 'UTXOS',
  BALANCE = 'BALANCE',
  USED_ADDRESS = 'USED_ADDRESS',
  UNUSED_ADDRESS = 'UNUSED_ADDRESS',
  CHANGE_ADDRESS = 'CHANGE_ADDRESS',
  SIGN_TX = 'SIGN_TX',
  SIGN_TX_INPUT = 'SIGN_TX_INPUT',
  SIGN_DATA = 'SIGN_DATA',
  SUBMIT_TX = 'SUBMIT_TX',
}

interface ConnectedDAppLogPropsType {
  name: string;
  date: string;
  args?: { [key: string]: any };
  input?: any;
  output?: any;
}

function format_date(date: string) {
  const d = new Date(Date.parse(date));
  return d.toLocaleString();
}
function format_value(value: number | string) {
  if (typeof value === 'number') return value.toLocaleString();
  return value;
}

const IdButton = (props: ButtonProps) => (
  <Button
    {...props}
    variant="text"
    endIcon={<ChevronRightIcon />}
    sx={{ p: 1, mx: -1 }}
  />
);

export default function (props: ConnectedDAppLogPropsType) {
  const { name, date, args = {}, input, output } = props;
  const title = useMemo(() => {
    switch (name) {
      case DAppActions.REQUEST_ACCESS:
        return 'Request Read Access';
      case DAppActions.CHECK_ACCESS:
        return 'Check Read Access';
      case DAppActions.UTXOS:
        return 'Get Unspent Boxes';
      case DAppActions.BALANCE:
        return 'Get Balance';
      case DAppActions.USED_ADDRESS:
        return 'Used Addresses';
      case DAppActions.UNUSED_ADDRESS:
        return 'Unused Addresses';
      case DAppActions.CHANGE_ADDRESS:
        return 'Change Address';
      case DAppActions.SIGN_TX:
        return 'Sign Transaction';
      case DAppActions.SIGN_TX_INPUT:
        return 'Sign Transaction Input';
      case DAppActions.SIGN_DATA:
        return 'Sign Data';
      case DAppActions.SUBMIT_TX:
        return 'Submit Transaction';
      default:
        return name;
    }
  }, [name]);
  const icon = useMemo(() => {
    switch (name) {
      case DAppActions.REQUEST_ACCESS:
        return <AccessibilityNewOutlinedIcon />;
      case DAppActions.CHECK_ACCESS:
        return <PublishedWithChangesOutlinedIcon />;
      case DAppActions.CHANGE_ADDRESS:
      case DAppActions.USED_ADDRESS:
        return <CreditCardOutlinedIcon />;
      case DAppActions.UNUSED_ADDRESS:
        return <CreditCardOffOutlinedIcon />;
      case DAppActions.SIGN_TX:
      case DAppActions.SIGN_TX_INPUT:
      case DAppActions.SIGN_DATA:
        return <DrawOutlinedIcon />;
      case DAppActions.BALANCE:
        return <BalanceOutlinedIcon />;
      case DAppActions.SUBMIT_TX:
        return <SendOutlinedIcon />;
      default:
        return <Inventory2OutlinedIcon />;
    }
  }, [name]);
  const content = useMemo(() => {
    switch (name) {
      case DAppActions.REQUEST_ACCESS:
      case DAppActions.CHECK_ACCESS:
        return (
          <Alert color={args.output ? 'success' : 'error'} icon={false}>
            {args.output ? 'Success' : 'Failed'}
          </Alert>
        );
      case DAppActions.UTXOS:
        return (
          <Fragment>
            <Card sx={{ p: 2 }} elevation={0}>
              <Stack spacing={1}>
                <Typography>
                  {format_value(args.amount)} {args.token_id}
                </Typography>
                {Array.isArray(args.output) && (
                  <Box>
                    {args.output.length > 0 ? (
                      args.output?.map((box, index) => (
                        <DisplayId
                          id={box.boxId}
                          key={index}
                          component={IdButton}
                        />
                      ))
                    ) : (
                      <Typography>None</Typography>
                    )}
                  </Box>
                )}
              </Stack>
            </Card>
          </Fragment>
        );
      case DAppActions.BALANCE:
        return (
          <Card sx={{ p: 2 }} elevation={0}>
            {format_value(args.output)} {args.token_id}
          </Card>
        );
      case DAppActions.USED_ADDRESS:
      case DAppActions.UNUSED_ADDRESS:
        return (
          <Alert color="info" icon={false}>
            {Array.isArray(args.output) && args.output.length > 0 ? (
              args.output?.map((address, index) => (
                <DisplayId id={address} key={index} />
              ))
            ) : (
              <Typography>None</Typography>
            )}
          </Alert>
        );
      case DAppActions.SUBMIT_TX:
      case DAppActions.CHANGE_ADDRESS:
        return (
          <Alert color="info" icon={false}>
            <DisplayId id={args.output} />
          </Alert>
        );
      case DAppActions.SIGN_TX:
        return (
          <Alert color="info" icon={false}>
            <DisplayId id={args.id} />
          </Alert>
        );
      case DAppActions.SIGN_TX_INPUT:
        return (
          <Card sx={{ p: 2 }} elevation={0}>
            <Stack spacing={1}>
              <DisplayId label="Transaction Id" id={args.id} />
              <DisplayProperty label="Input Id" value={args.input_id} />
              <DisplayProperty label="Input Index" value={args.input_index} />
            </Stack>
          </Card>
        );
      case DAppActions.SIGN_DATA:
        return (
          <Card sx={{ p: 2 }} elevation={0}>
            <Typography variant="body2" color="textSecondary">
              Data
            </Typography>
            <Typography color="textPrimary">{args.output}</Typography>
          </Card>
        );
      default:
        return null;
    }
  }, [name, output, input]);

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          sx={{
            height: 32,
            width: 32,
            bgcolor: '#ffffff88',
            border: '1px solid #ddd',
            color: 'primary.dark',
          }}
        >
          {cloneElement(icon, { sx: { width: 16, height: 16 } })}
        </Avatar>
        <Typography variant="h5" color="textPrimary">
          {title}
        </Typography>
      </Box>
      <Box
        ml={2}
        pl={4}
        pb={3}
        display="flex"
        gap={1}
        flexDirection="column"
        sx={{ borderLeft: '1px dashed #ddd' }}
      >
        {content}
        <Typography color="textSecondary" variant="body2">
          {format_date(date)}
        </Typography>
      </Box>
    </Box>
  );
}
