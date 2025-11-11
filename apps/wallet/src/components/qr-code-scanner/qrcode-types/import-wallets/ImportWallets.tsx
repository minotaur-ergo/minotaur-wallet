import { useCallback, useEffect, useState } from 'react';

import {
  ExportWallet,
  QrCodeScannedComponentPropsType,
  RestoreWalletWithSelection,
} from '@minotaur-ergo/types';
import { Checklist } from '@mui/icons-material';
import { Button, IconButton, Stack } from '@mui/material';

import BackButton from '@/components/back-button/BackButton';
import WalletItem from '@/components/export-import/WalletItem';
import ImportWalletProblemMessage from '@/components/qr-code-scanner/qrcode-types/import-wallets/ImportWalletProblemMessage';
import useImportProgress from '@/hooks/export/useImportProgress';
import { useSelection } from '@/hooks/export/useSelection';
import AppFrame from '@/layouts/AppFrame';
import { checkForProblems } from '@/utils/import';

const ImportWallets = (props: QrCodeScannedComponentPropsType) => {
  const [data, setData] = useState<Array<RestoreWalletWithSelection>>([]);
  const [loading, setLoading] = useState(false);
  const [proceedData, setProceedData] = useState('');
  const [index, setIndex] = useState(-1);
  useImportProgress(data, setData, index, setIndex);
  useEffect(() => {
    if (!loading && proceedData !== props.scanned) {
      setLoading(true);
      const scannedData = JSON.parse(props.scanned) as Array<ExportWallet>;
      checkForProblems(scannedData).then((dataWithSelection) => {
        setProceedData(props.scanned);
        setData(dataWithSelection);
        setLoading(false);
      });
    }
  }, [loading, props.scanned, proceedData]);
  const close = useCallback(() => {
    setData([]);
    setProceedData('');
    setIndex(-1);
    props.close();
  }, [props]);
  const start = useCallback(() => {
    if (index < 0) {
      setIndex(0);
    } else if (index === data.length) {
      close();
    }
  }, [index, data, close]);
  const valid = useCallback((row: RestoreWalletWithSelection) => {
    return (
      row.flags.duplicate === undefined &&
      row.flags.noSignerWallet === undefined
    );
  }, []);
  const { select, selectAll, selectedCount, total } = useSelection(
    data,
    setData,
    valid,
  );
  return (
    <AppFrame
      title="Import Wallets"
      navigation={<BackButton onClick={close} />}
      actions={
        <IconButton
          color={total === 0 || total > selectedCount ? 'default' : 'primary'}
          onClick={() => selectAll(total > selectedCount)}
        >
          <Checklist />
        </IconButton>
      }
      toolbar={
        <Button
          variant="contained"
          onClick={start}
          disabled={selectedCount === 0 || (index < data.length && index > -1)}
          sx={{ mt: 2 }}
        >
          {index === -1 ? (
            <span>
              Import {selectedCount} Wallet{selectedCount > 1 ? 's' : ''}
            </span>
          ) : (
            <span>Done</span>
          )}
        </Button>
      }
    >
      <Stack gap={2}>
        {data.map((item, index) => (
          <WalletItem
            key={index}
            selected={item.selected}
            wallet={item.wallet}
            disabled={
              item.flags.duplicate !== undefined ||
              item.flags.noSignerWallet !== undefined
            }
            handleSelection={() => select(index)}
            status={index >= 0 ? item.status : undefined}
            message={<ImportWalletProblemMessage {...item.flags} />}
          />
        ))}
      </Stack>
    </AppFrame>
  );
};

export default ImportWallets;
