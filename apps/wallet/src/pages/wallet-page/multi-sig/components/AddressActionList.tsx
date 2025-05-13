import { CircleOutlined, TaskAltOutlined } from '@mui/icons-material';
import { Stack } from '@mui/material';
import DisplayId from '@/components/display-id/DisplayId';
import { AddressActionRow } from '@/types/multi-sig-old';
import { useContext } from 'react';
import { MultiSigDataContext } from '@/components/sign/context/MultiSigDataContext';

interface AddressActionListPropsType {
  addresses: Array<AddressActionRow>;
}

const AddressActionList = (props: AddressActionListPropsType) => {
  const multiDataContext = useContext(MultiSigDataContext);
  const myAddress = {
    address: multiDataContext.related?.addresses[0].address ?? '',
    name: 'My Own Wallet',
  };
  return (
    <Stack spacing={0.5}>
      {props.addresses.map((row, index) => (
        <DisplayId
          key={index}
          id={row.address}
          showAddress={true}
          customAddresses={[myAddress]}
          color={row.completed ? 'success.main' : 'textPrimary'}
          prefixDisplay={
            row.completed ? (
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
  );
};

export default AddressActionList;
