import React, { useState } from 'react';
import { Box, Card, Chip } from '@mui/material';

interface CustomChipPropsType {
  word: string;
}

export default function ConfirmMnemonic() {
  const [mnemonics, set_mnemonics] = useState<string[]>([]);
  const words = ['east', 'when', 'betray', 'also', 'rescue', 'subway'];

  const handle_select = (word: string) => () => {
    set_mnemonics((prevState) => [...prevState, word]);
  };
  const handle_deselect = (word: string) => () => {
    set_mnemonics((prevState) => {
      const newState = [...prevState];
      const index = newState.indexOf(word);
      newState.splice(index, 1);
      return newState;
    });
  };

  const CustomChip = ({ word }: CustomChipPropsType) => {
    const isSelected = mnemonics.indexOf(word) > -1;
    return (
      <Chip
        label={word}
        onClick={handle_select(word)}
        disabled={isSelected}
        variant="outlined"
        sx={{
          color: isSelected ? 'transparent' : 'unset',
          bgcolor: isSelected ? 'ddd' : '#c7ddff',
        }}
      />
    );
  };

  return (
    <Box>
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
        {mnemonics.map((word, index) => (
          <Chip label={word} key={index} onClick={handle_deselect(word)} />
        ))}
      </Card>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
        {words.map((word, index) => (
          <CustomChip key={index} word={word} />
        ))}
      </Box>
    </Box>
  );
}
