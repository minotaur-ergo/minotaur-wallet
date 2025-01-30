import { Button } from '@mui/material';

interface AllAmountButtonProps {
  amount: number;
  onClick?: (amount: number) => void;
}

export default function AllAmountButton({
  amount,
  onClick,
}: AllAmountButtonProps) {
  return (
    <Button
      variant="text"
      fullWidth={false}
      sx={{ minWidth: 'unset', color: 'info.dark', py: 0, px: 1, ml: -1 }}
      onClick={() => onClick && onClick(amount)}
    >
      {amount} available
    </Button>
  );
}
