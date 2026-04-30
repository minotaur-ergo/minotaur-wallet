import { MultiSigBriefRow, StateWallet } from '@minotaur-ergo/types';
import { ContentPasteOutlined, QrCodeScanner } from '@mui/icons-material';
import { Box, Fab } from '@mui/material';

import FabStack from '@/components/fab-stack/FabStack';
import ListController from '@/components/list-controller/ListController';

import MultiSigTransactionItem from './MultiSigTransactionItem';

interface MultiSigCommunicationManualTabPropsType {
  wallet: StateWallet;
  items: Array<MultiSigBriefRow>;
  loading: boolean;
  reading: boolean;
  onReadQrCode: () => void;
  onPasteNewTransaction: () => void;
}

const MultiSigCommunicationManualTab = (
  props: MultiSigCommunicationManualTabPropsType,
) => {
  return (
    <Box>
      <Box
        sx={{
          height: 'calc(100dvh - 280px)',
          minHeight: 260,
          overflowY: 'auto',
        }}
      >
        <ListController
          loading={props.loading}
          error={false}
          errorDescription={''}
          errorTitle={''}
          data={props.items}
          render={(row) => (
            <MultiSigTransactionItem
              wallet={props.wallet}
              txId={row.txId}
              ergIn={row.ergIn}
              ergOut={row.ergOut}
              signs={row.signed}
              commitments={row.committed}
              tokensIn={row.tokensIn}
              tokensOut={row.tokensOut}
            />
          )}
          divider={false}
          emptyTitle="There is no transaction in progress!"
          emptyDescription="You can add transaction using botton below to start signing process"
          emptyIcon="folder"
        />
      </Box>
      <FabStack direction="row-reverse" spacing={2}>
        <Fab
          disabled={props.reading}
          onClick={props.onReadQrCode}
          color="primary"
        >
          <QrCodeScanner />
        </Fab>
        <Fab
          disabled={props.reading}
          onClick={props.onPasteNewTransaction}
          color="primary"
        >
          <ContentPasteOutlined />
        </Fab>
      </FabStack>
    </Box>
  );
};

export default MultiSigCommunicationManualTab;
