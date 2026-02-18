import { useEffect, useMemo, useState } from 'react';

import { Box, Card, Chip, Container, Grid } from '@mui/material';

import CustomChip from './CustomChip';

interface ConfirmMnemonicPropsType {
  mnemonic: string;
  setHasError: (hasError: boolean) => unknown;
}

const ConfirmMnemonic = (props: ConfirmMnemonicPropsType) => {
  const [created, setCreated] = useState<{
    mnemonic: string;
    indexes: Array<number>;
  }>({
    mnemonic: '',
    indexes: [],
  });
  const mnemonicWords = useMemo(
    () => props.mnemonic.split(' '),
    [props.mnemonic],
  );
  const mnemonicWordsSorted = useMemo(
    () => [...mnemonicWords.sort()],
    [mnemonicWords],
  );
  const createdWords = created.mnemonic
    .split(' ')
    .filter((item) => item !== '');
  const handleMnemonicRemoveClick = (index: number) => {
    if (created.indexes.length > index) {
      const newCreated = created.mnemonic.split(' ');
      newCreated.splice(index, 1);
      const indexes = [...created.indexes];
      indexes.splice(index, 1);
      setCreated({
        mnemonic: newCreated.join(' '),
        indexes: indexes,
      });
    }
  };
  const handleMnemonicClick = (index: number) => {
    if (created.indexes.indexOf(index) === -1) {
      setCreated({
        mnemonic: (created.mnemonic + ' ' + mnemonicWords[index]).trim(),
        indexes: [...created.indexes, index],
      });
    }
  };
  useEffect(() => {
    props.setHasError(created.mnemonic !== props.mnemonic);
  });
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              minHeight: 72,
              p: 1.5,
            }}
            elevation={0}
          >
            {createdWords.map((word, index) => (
              <Chip
                label={word}
                key={index}
                onClick={() => handleMnemonicRemoveClick(index)}
              />
            ))}
          </Card>
        </Grid>
        <Grid item xs={12}>
          <p>
            Your mnemonic is the only way to recover this wallet. If you lose
            it, your money will be permanently lost. To make sure that you have
            properly saved it, please reorder it here
          </p>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
            {mnemonicWordsSorted.map((word, index) => (
              <CustomChip
                key={index}
                word={word}
                selected={created.indexes.indexOf(index) !== -1}
                handleSelect={() => handleMnemonicClick(index)}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ConfirmMnemonic;
