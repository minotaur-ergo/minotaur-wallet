import { useState } from 'react';

type DrawerOutput = {
  handleOpen: () => unknown;
  open: boolean;
  handleClose: () => void;
};

const useDrawer = (): DrawerOutput => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return {
    handleOpen,
    open,
    handleClose,
  };
};

export default useDrawer;
