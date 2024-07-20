import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';
import { Box, Button, Drawer, Grid, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ExportAddressItem from './ExportAddressItem';
import { ADDRESS_BOOK } from '../../../data';
import { useEffect, useMemo, useState } from 'react';
import {
  Checklist,
  Close,
  ContentCopy,
  Download,
  QrCode,
} from '@mui/icons-material';
import SquareButton from '../../../components/SquareButton';

export type AddressType = {
  name: string;
  address: string;
  selected?: boolean;
};

const ExportAddresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [open, setOpen] = useState(false);
  const totalCount = useMemo(() => addresses.length, [addresses]);
  const checkedCount = useMemo(
    () => addresses.filter(({ selected }) => selected).length,
    [addresses]
  );

  const getAddresses = () =>
    new Promise<AddressType[]>((resolve) => {
      resolve(ADDRESS_BOOK);
    });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleToggle = (item: AddressType, checked: boolean) => {
    console.log(item, checked);
    const newAddresses = [...addresses];
    const index = newAddresses.findIndex(
      ({ address }) => address === item.address
    );
    if (index > -1) {
      newAddresses[index].selected = checked;
    }
    setAddresses(newAddresses);
  };

  const handleSelectAll = () => {
    const newAddresses = [...addresses];
    newAddresses.forEach((item) => {
      item.selected = checkedCount !== totalCount;
    });
    setAddresses(newAddresses);
    // setAddresses(
    //   addresses.map((item) => ({
    //     ...item,
    //     selected: checkedCount !== totalCount,
    //   }))
    // );
  };

  const handleSubmit = () => {
    navigate(-1);
  };

  useEffect(() => {
    getAddresses().then((data) => setAddresses(data));
  }, []);

  return (
    <AppFrame
      title={`${checkedCount} Selected`}
      navigation={<BackButton />}
      actions={
        <IconButton
          color={checkedCount < totalCount ? 'default' : 'primary'}
          onClick={handleSelectAll}
        >
          <Checklist />
        </IconButton>
      }
      toolbar={
        <Button onClick={handleOpen} disabled={checkedCount === 0}>
          Export as
        </Button>
      }
    >
      <Stack gap={2}>
        {addresses.map((item, index) => (
          <ExportAddressItem key={index} {...item} onChange={handleToggle} />
        ))}
      </Stack>
      <Drawer anchor="bottom" open={open} onClose={handleClose}>
        <Box display="flex" mb={2}>
          <Box sx={{ flexBasis: 40 }} />
          <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
            Exporting {checkedCount} Address{checkedCount > 1 ? 'es' : ''}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <SquareButton label="Download" icon={<Download />} />
          </Grid>
          <Grid item xs={4}>
            <SquareButton
              label="Copy"
              icon={<ContentCopy />}
              color="secondary.main"
            />
          </Grid>
          <Grid item xs={4}>
            <SquareButton
              label="QR Code"
              icon={<QrCode />}
              color="success.main"
            />
          </Grid>
        </Grid>
      </Drawer>
    </AppFrame>
  );
};

export default ExportAddresses;
