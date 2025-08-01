import { CSSProperties } from 'react';

import { useTheme } from '@mui/material';

interface PropsType {
  style?: CSSProperties;
}

const MinotaurLogo = (props: PropsType) => {
  const theme = useTheme();
  return (
    <svg
      version="1.0"
      viewBox="0 0 1337 1337"
      xmlns="http://www.w3.org/2000/svg"
      style={props.style}
    >
      <path
        d="M12 280l178.333 140h187c170 0 170 0 263.334 140L660 589l-85 127.5L470.667 560h-187c-85 0-85 0-178.334-140L12 280zM1042 577H872L677 869.5 762 997l140-210c10-15 25-75 10-90 50 0 50 0 130-120h0z"
        fill={theme.palette.primary.light}
      />
      <path
        d="M295 577h170l280 420H575L435 787c-10-15-25-75-10-90-50 0-50 0-130-120h0z M1325 280l-178.333 140h-187c-170 0-170 0-263.334 140L583.5 729.25l85 127.5L866.333 560h187c85 0 85 0 178.334-140L1325 280z"
        fill={theme.palette.secondary.main}
      />
    </svg>
  );
};

export default MinotaurLogo;
