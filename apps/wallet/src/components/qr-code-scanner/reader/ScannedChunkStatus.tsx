import StatusBox from '@/components/qr-code-scanner/reader/StatusBox';
import { Box, Typography } from '@mui/material';


interface ScannedChunkStatusPropsType {
  chunks?: Array<string>;
  error?: string;
}

const ScannedChunkStatus = (props: ScannedChunkStatusPropsType) => {
  return (
    <Box color="common.white" textAlign="center" p={0}>
      <Typography color="warning.light" mb={3}>
        {props.error}
      </Typography>
      <Box display="flex" style={{zIndex: 10000}} flexWrap="wrap" justifyContent="center">
        {(props.chunks ?? []).map((item, index) => (
          <StatusBox
            value={item}
            key={index}
          />
        ))}
      </Box>
    </Box>
  )
}

export default ScannedChunkStatus;