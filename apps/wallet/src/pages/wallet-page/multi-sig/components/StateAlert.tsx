import { useContext } from 'react';

import { Alert, AlertColor, AlertTitle } from '@mui/material';

import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { MultiSigDataContext } from '@/components/sign/context/MultiSigDataContext';
import { MultiSigStateEnum } from '@/hooks/multi-sig/useMultiSigTxState';

const StateAlert = () => {
  const context = useContext(MultiSigContext);
  const dataContext = useContext(MultiSigDataContext);
  const actions = dataContext.actions;
  const committedCount = actions.filter((item) => item.committed).length;
  const signedCount = actions.filter((item) => item.signed).length;
  const step: number =
    dataContext.state === MultiSigStateEnum.COMMITMENT
      ? committedCount
      : signedCount;
  const requiredSign = context.requiredSign;
  const remain = requiredSign - step;
  const getColor = (): AlertColor => {
    switch (dataContext.state) {
      case MultiSigStateEnum.COMMITMENT:
        return 'warning';
      case MultiSigStateEnum.SIGNING:
        return 'info';
      case MultiSigStateEnum.COMPLETED:
        return 'success';
      default:
        return 'error';
    }
  };

  const getTitle = () => {
    switch (dataContext.state) {
      case MultiSigStateEnum.COMPLETED:
        return 'Transaction completed!';
      case MultiSigStateEnum.SIGNING:
        return `${remain} more signature${remain > 1 ? 's' : ''}!`;
      case MultiSigStateEnum.COMMITMENT:
        return step === 0
          ? `${requiredSign} commitments are required!`
          : `${remain} more commitment${remain > 1 ? 's' : ''}!`;
      default:
        return ' ';
    }
  };

  const getDescription = () => {
    switch (dataContext.state) {
      case MultiSigStateEnum.COMMITMENT:
        return step === 0
          ? ` `
          : `${step} of ${requiredSign} required commitment collected.`;
      case MultiSigStateEnum.SIGNING:
      case MultiSigStateEnum.COMPLETED:
        return `Signed by ${step} of ${requiredSign} required signers.`;
      default:
        return '';
    }
  };

  return (
    <Alert severity={getColor()} icon={false}>
      <AlertTitle>{getTitle()}</AlertTitle>
      {getDescription()}
    </Alert>
  );
};

export default StateAlert;
