import { CSSProperties, useMemo } from 'react';
import { useTheme } from '@mui/material';
import ErgoIcon from './ErgoIcon';
import DocumentIcon from './DocumentIcon';
import ApprovedIcon from './ApprovedIcon';
import FolderIcon from './FolderIcon';
import WarningIcon from './WarningIcon';
import ErrorIcon from './ErrorIcon';
import InfoIcon from './InfoIcon';

interface SvgIconPropsType {
  icon: string;
  width?: number;
  opacity?: number;
  color?: string;
  style?: CSSProperties;
}

const SvgIcon = (props: SvgIconPropsType) => {
  const theme = useTheme();
  const styles = useMemo(() => {
    const getColor = () => {
      switch (props.color) {
        case 'error':
          return theme.palette.error;
        case 'warning':
          return theme.palette.warning;
        case 'primary':
          return theme.palette.primary;
        case 'secondary':
          return theme.palette.secondary;
        case 'success':
          return theme.palette.success;
      }
      return theme.palette.info;
    };
    return {
      fill: getColor().dark,
      width: props.width ? props.width : 100,
      opacity: props.opacity ? props.opacity : 0.4,
      ...props.style,
    };
  }, [theme, props.width, props.opacity, props.color, props.style]);
  switch (props.icon) {
    case 'ergo':
      return <ErgoIcon styles={styles} />;
    case 'document':
      return <DocumentIcon styles={styles} />;
    case 'folder':
      return <FolderIcon styles={styles} />;
    case 'approved':
      return <ApprovedIcon styles={styles} />;
    case 'warning':
      return <WarningIcon styles={styles} />;
    case 'error':
      return <ErrorIcon styles={styles} />;
    case 'info':
      return <InfoIcon styles={styles} />;
  }
  return null;
};

export default SvgIcon;
