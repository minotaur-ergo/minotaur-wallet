import React, { useEffect, useState } from 'react';

import { Button, Stack, TextField, Typography } from '@mui/material';

interface AddressEditCardPropsType {
  name: string;
  setName: (newName: string) => unknown;
  handleCancel: () => unknown;
}

const AddressEditCard = (props: AddressEditCardPropsType) => {
  const [propsName, setPropsName] = useState(props.name);
  const [name, setName] = useState(props.name);
  useEffect(() => {
    if (props.name !== propsName) {
      setPropsName(props.name);
      setName(props.name);
    }
  }, [props.name, propsName]);
  return (
    <React.Fragment>
      <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
        Edit Address Name
      </Typography>
      <TextField
        variant="standard"
        value={name}
        onChange={(e) => setName(e.target.value)}
        inputProps={{ autoFocus: true }}
      />
      <Stack direction="row-reverse" spacing={2}>
        <Button
          onClick={() => props.setName(name)}
          variant="text"
          fullWidth={false}
          sx={{ px: 0, minWidth: 0 }}
        >
          Save
        </Button>
        <Button
          onClick={props.handleCancel}
          variant="text"
          fullWidth={false}
          sx={{ px: 0, minWidth: 0 }}
        >
          Cancel
        </Button>
      </Stack>
    </React.Fragment>
  );
};

export default AddressEditCard;
