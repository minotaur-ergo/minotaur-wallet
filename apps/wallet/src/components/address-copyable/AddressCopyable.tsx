import { ContentCopy } from '@mui/icons-material';
import { Alert, Box, CardActionArea, Typography } from '@mui/material';

import CopyToClipboard from '@/components/copy-to-clipboard/CopyToClipboard';

interface PropsType {
  address: string;
}

const AddressCopyable = (props: PropsType) => {
  return (
    <CopyToClipboard text={props.address}>
      <CardActionArea>
        <Alert severity="info" icon={false}>
          <Box display="flex">
            <Typography sx={{ overflowWrap: 'anywhere' }}>
              {props.address}
            </Typography>
            <ContentCopy />
          </Box>
        </Alert>
      </CardActionArea>
    </CopyToClipboard>
  );
};

export default AddressCopyable;
