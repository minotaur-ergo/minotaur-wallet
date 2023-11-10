import { Backdrop, CircularProgress } from '@mui/material';

interface BackdropLoadingPropsType {
  open?: boolean;
}

const BackdropLoading = ({ open = false }: BackdropLoadingPropsType) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackdropLoading;
