import { useContext, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { BoxContent, StateWallet } from '@minotaur-ergo/types';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';

import useTxBoxes from '@/hooks/useTxBoxes';

import { TxDataContext } from '../context/TxDataContext';
import BoxItem from './BoxItem';

interface TransactionBoxesPropsType {
  open: boolean;
  handleClose: () => void;
  signed?: wasm.Transaction;
  boxes?: Array<wasm.ErgoBox>;
  wallet?: StateWallet;
}

interface TransactionBoxesContentPropsType extends Omit<
  TransactionBoxesPropsType,
  'open'
> {
  scrollParent: HTMLElement;
}

const ListHeader = (props: {
  title: string;
  description: string;
  first: boolean;
}) => (
  // padding instead of margin: virtuoso measures item height without margins
  <Box pt={props.first ? 0 : 1}>
    <Typography variant="h2" color="textSecondary">
      {props.title}
    </Typography>
    <Typography variant="body2" color="textSecondary" pb={2}>
      {props.description}
    </Typography>
  </Box>
);

// Rendered as the drawer's child so boxes are processed only while the drawer is
// open: the drawer does not mount its children when closed. A transaction can
// have thousands of boxes, so the list is virtualized and a box is converted
// only when its row becomes visible.
const TransactionBoxesContent = (props: TransactionBoxesContentPropsType) => {
  const context = useContext(TxDataContext);
  const reader = useTxBoxes(
    props.wallet ?? context.wallet,
    props.boxes ?? context.boxes,
    props.signed ?? context.tx,
  );
  const networkType = context.networkType
    ? context.networkType
    : (props.wallet?.networkType ?? '');
  // rows: inputs header, inputs, outputs header, outputs
  const outputsHeaderIndex = reader.inputCount + 1;
  const renderBox = (box: BoxContent | undefined) => (
    <Box pb={2} display="flex">
      {box ? (
        <BoxItem
          tokens={box.tokens}
          networkType={networkType}
          address={box.address}
          amount={box.amount}
          wallet={context.wallet}
        />
      ) : (
        <Typography color="error">Input box is not available</Typography>
      )}
    </Box>
  );
  const renderRow = (index: number) => {
    if (index === 0) {
      return (
        <ListHeader
          title="Transaction Inputs"
          description="These elements spent in transaction"
          first={true}
        />
      );
    }
    if (index < outputsHeaderIndex)
      return renderBox(reader.getInput(index - 1));
    if (index === outputsHeaderIndex) {
      return (
        <ListHeader
          title="Transaction Outputs"
          description="These elements will be created in transaction"
          first={false}
        />
      );
    }
    return renderBox(reader.getOutput(index - outputsHeaderIndex - 1));
  };
  return (
    <Box>
      <Box display="flex" mb={2}>
        <Box sx={{ flexBasis: 40 }} />
        <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
          Boxes
        </Typography>
        <IconButton onClick={props.handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Virtuoso
        customScrollParent={props.scrollParent}
        totalCount={reader.inputCount + reader.outputCount + 2}
        itemContent={renderRow}
      />
    </Box>
  );
};

const TransactionBoxes = (props: TransactionBoxesPropsType) => {
  const { open, ...contentProps } = props;
  const [paper, setPaper] = useState<HTMLDivElement | null>(null);
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={props.handleClose}
      PaperProps={{
        ref: setPaper,
        sx: { p: 3, pt: 1, borderTopRightRadius: 20, borderTopLeftRadius: 20 },
      }}
    >
      {paper ? (
        <TransactionBoxesContent {...contentProps} scrollParent={paper} />
      ) : null}
    </Drawer>
  );
};

export default TransactionBoxes;
