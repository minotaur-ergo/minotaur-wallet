import { Box, Typography } from '@mui/material';

import JSONDescription from './JSONDescription';

export interface AssetItemDescriptionPropsType {
  description?: string;
}

const AssetItemDescription = (props: AssetItemDescriptionPropsType) => {
  const getParsedJson = (str: string) => {
    try {
      const obj = JSON.parse(str);
      return obj && typeof obj === 'object' ? obj : null;
    } catch {
      return null;
    }
  };

  const parsedData = getParsedJson(props.description || '');

  return (
    <Box sx={{ mt: 1 }}>
      {parsedData ? (
        <Box
          sx={{
            p: 2,
            bgcolor: '#f9f9f9',
            borderRadius: '4px',
            border: '1px solid #eee',
            overflow: 'hidden',
          }}
        >
          <JSONDescription description={parsedData} />
        </Box>
      ) : (
        <Typography>{props.description}</Typography>
      )}
    </Box>
  );
};
export default AssetItemDescription;
