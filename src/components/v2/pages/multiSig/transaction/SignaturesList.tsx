import { Stack, Typography } from '@mui/material';
import { MultiSigSignatureType } from '../../../models';
import DisplayId from '../../../components/DisplayId';
import { CircleOutlined, TaskAltOutlined } from '@mui/icons-material';

const SignaturesList = ({
  signatures,
  title,
}: {
  signatures: MultiSigSignatureType[];
  title?: string;
}) => {
  return (
    <div>
      {title && (
        <Typography variant="body2" color="text.secondary" mb={1}>
          {title}
        </Typography>
      )}
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
    </div>
  );
};

export default SignaturesList;
