import { useEffect, useMemo, useState } from 'react';

import { CheckRounded, ContentCopyRounded } from '@mui/icons-material';
import { Box, Button, Chip } from '@mui/material';

import ConfirmCopy from '@/components/copy-to-clipboard/ConfirmCopy';

interface PropsType {
  mnemonic: string;
  hideIndex?: Array<number>;
  handleClick?: (index: number) => unknown;
}

const MNEMONIC_COPY_CONFIRM_MESSAGE =
  'Copying your mnemonic phrase may expose it to other applications. It is safer to write it down on paper. Are you sure you want to copy it?';

const MnemonicView = (props: PropsType) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const words = useMemo(
    () => (props.mnemonic ? props.mnemonic.split(' ') : []),
    [props.mnemonic],
  );
  const hideIndex = useMemo(
    () => (props.hideIndex ? props.hideIndex : []),
    [props.hideIndex],
  );

  useEffect(() => {
    if (!isCopied) {
      return;
    }
    const copiedTimer = setTimeout(() => setIsCopied(false), 1800);
    return () => clearTimeout(copiedTimer);
  }, [isCopied]);

  const handleClick = (index: number) => {
    if (props.handleClick) {
      props.handleClick(index);
    }
  };

  const handleOpenConfirm = () => {
    if (props.mnemonic && !isCopied) {
      setIsConfirmOpen(true);
    }
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
  };

  const handleConfirmCopy = () => {
    setIsConfirmOpen(false);
    setIsCopied(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
        {words.map((word, index) => (
          <Chip
            label={word}
            key={index}
            onClick={() => handleClick(index)}
            style={{ opacity: hideIndex.indexOf(index) === -1 ? 1 : 0 }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleOpenConfirm}
          disabled={!props.mnemonic}
          startIcon={
            isCopied ? (
              <CheckRounded fontSize="small" />
            ) : (
              <ContentCopyRounded fontSize="small" />
            )
          }
          aria-label="Copy mnemonic phrase"
          sx={(theme) => ({
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            px: 1.75,
            py: 0.75,
            minWidth: 132,
            color: isCopied
              ? theme.palette.success.dark
              : theme.palette.text.secondary,
            borderColor: isCopied
              ? theme.palette.success.main
              : theme.palette.divider,
            backgroundColor: isCopied
              ? theme.palette.success.light
              : theme.palette.background.paper,
            transition: theme.transitions.create(
              ['background-color', 'border-color', 'color', 'box-shadow'],
              { duration: theme.transitions.duration.shorter },
            ),
            boxShadow: isCopied
              ? `0 0 0 1px ${theme.palette.success.main}`
              : 'none',
          })}
        >
          {isCopied ? 'Copied' : 'Copy phrase'}
        </Button>
      </Box>

      <ConfirmCopy
        open={isConfirmOpen}
        textToCopy={props.mnemonic}
        confirmMessage={MNEMONIC_COPY_CONFIRM_MESSAGE}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmCopy}
      />
    </Box>
  );
};

export default MnemonicView;
