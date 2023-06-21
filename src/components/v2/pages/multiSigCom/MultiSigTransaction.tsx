import React, { useMemo, useState } from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import BoxIcon from '@mui/icons-material/Inventory2Outlined';
import DeleteIcon from '@mui/icons-material/DeleteForeverOutlined';
import {
  Box,
  Button,
  ListItemIcon,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  FormHelperText,
  Stack,
  Alert,
  AlertTitle,
  AlertColor,
} from '@mui/material';
import TransactionBoxes from '../send/TransactionBoxes';
import PasswordField from '../../components/PasswordField';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useParams } from 'react-router-dom';
import { MSTransactions } from '../../data';
import {
  ContentPasteOutlined,
  ShareOutlined,
  ContentCopyOutlined,
  CircleOutlined,
  TaskAltOutlined,
} from '@mui/icons-material';
import DisplayId from '../../components/DisplayId';

interface MultiSigTransactionType {
  stateId: 'COMMITMENT' | 'SIGNING' | 'COMPLETED';
  step?: number;
  totalSteps?: number;
}

interface MultiSigTransSignatureType {
  id: string;
  signed?: boolean;
}

const SubmitButton = ({ transaction, set_transaction }: any) => {
  const { needAction, stateId, totalSteps, step } = transaction;
  const state = useMemo(() => {
    if (!needAction)
      return {
        buttonLabel: 'Read from Clipboard',
        icon: <ContentPasteOutlined />,
        onClick: () => console.log('Read from Clipboard'),
      };
    const rem = totalSteps - step;
    switch (stateId) {
      case 'COMMITMENT':
        return {
          buttonLabel:
            rem === 1 ? 'Commit and Process Sign' : 'Create Commitment',
          onClick: () => {
            set_transaction((prevState: any) => ({
              ...prevState,
              needAction: false,
              step: prevState.step + 1,
            }));
          },
        };
      case 'SIGNING':
        return {
          buttonLabel: 'Process Sign',
        };
      case 'COMPLETED':
        return {
          buttonLabel: 'Publish',
          icon: <ShareOutlined />,
        };
      default:
        return {};
    }
  }, [needAction, stateId, totalSteps, step]);

  return (
    <Button onClick={state.onClick} startIcon={state.icon}>
      {state.buttonLabel}
    </Button>
  );
};

const StateAlert = ({
  transaction,
}: {
  transaction: MultiSigTransactionType;
}) => {
  const { stateId, step = 0, totalSteps = 0 } = transaction;
  const state = useMemo(() => {
    const rem = totalSteps - step;
    switch (stateId) {
      case 'COMMITMENT':
        return {
          color: 'warning',
          title:
            step === 0
              ? `${totalSteps} commitments are required!`
              : `${rem} more commitment${rem > 1 ? 's' : ''}!`,
          description:
            step === 0
              ? ''
              : `${step} of ${totalSteps} required commitment collected.`,
        };
      case 'SIGNING':
        return {
          color: 'info',
          title: `${rem} more signature${rem > 1 ? 's' : ''}!`,
          description: `Signed by ${step} of ${totalSteps} required signers.`,
        };
      case 'COMPLETED':
        return {
          color: 'success',
          title: `Transaction completed!`,
          description: `Signed by ${step} of ${totalSteps} required signers.`,
        };
      default:
        return {
          color: 'info',
        };
    }
  }, [stateId, step]);

  return (
    <Alert severity={state.color as AlertColor} icon={false}>
      <AlertTitle>{state.title}</AlertTitle>
      {state.description}
    </Alert>
  );
};

const SignaturesList = ({
  signatures,
}: {
  signatures: MultiSigTransSignatureType[];
}) => {
  return (
    <Stack spacing={0.5}>
      {signatures.map((item, index) => (
        <DisplayId
          key={index}
          id={item.id}
          color={item.signed ? 'success.main' : 'textPrimary'}
          prefix={
            item.signed ? (
              <TaskAltOutlined
                fontSize="small"
                color="success"
                sx={{ mr: 1 }}
              />
            ) : (
              <CircleOutlined fontSize="small" sx={{ mr: 1 }} />
            )
          }
        />
      ))}
    </Stack>
  );
};

const MultiSigTransaction = () => {
  const [displayBoxes, setDisplayBoxes] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { id } = useParams();
  const [transaction, set_transaction] = useState<any>(
    () => MSTransactions.find((i) => i.id === id) || {}
  );

  const handleDisplayBoxes = () => {
    setDisplayBoxes(true);
    handle_close_menu();
  };
  const handleHideBoxes = () => {
    setDisplayBoxes(false);
  };

  const handle_open_menu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handle_close_menu = () => {
    setAnchorEl(null);
  };

  return (
    <AppFrame
      title="Multi-sig Transaction"
      navigation={<BackButton />}
      actions={
        <>
          <IconButton onClick={handle_open_menu}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handle_close_menu}>
            <MenuItem onClick={handleDisplayBoxes}>
              <ListItemIcon>
                <BoxIcon />
              </ListItemIcon>
              Show Boxes
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              Delete Transaction
            </MenuItem>
          </Menu>
        </>
      }
      toolbar={
        <SubmitButton
          transaction={transaction}
          set_transaction={set_transaction}
        />
      }
    >
      <StateAlert transaction={transaction} />

      <Box my={2}>
        <Typography variant="body2" color="textSecondary">
          Total spent
        </Typography>
        <Typography fontSize="large">
          {transaction.amount.toFixed(2)}{' '}
          <Typography component="span" variant="body2" color="textSecondary">
            ERG
          </Typography>
        </Typography>
        <FormHelperText>
          These amount will be spent when transaction proceed.
        </FormHelperText>
      </Box>

      <Box my={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Transaction{' '}
          {transaction.stateId === 'COMMITMENT' ? 'committed' : 'signed'} by
        </Typography>
        <SignaturesList signatures={transaction.signatures} />
      </Box>

      {transaction.needAction !== true && (
        <Box my={2}>
          <Typography gutterBottom>
            Please share transaction data to the other signers.
          </Typography>
          <Button variant="outlined" startIcon={<ContentCopyOutlined />}>
            Copy to Clipboard
          </Button>
        </Box>
      )}

      {transaction.needPassword === true && transaction.needAction === true && (
        <PasswordField
          label="Wallet Password"
          helperText="Please enter your mnemonics passphrase to send transaction."
        />
      )}

      <TransactionBoxes open={displayBoxes} handleClose={handleHideBoxes} />
    </AppFrame>
  );
};

export default MultiSigTransaction;
