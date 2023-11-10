import { useParams } from 'react-router-dom';
import AppFrame from '../../../layouts/AppFrame';
import { useMemo } from 'react';
import { WHITE_LIST } from '../../../data';
import BackButton from '../../../components/BackButton';

const ConnectedDApp = () => {
  const { dappid } = useParams();
  const dApp = useMemo(() => WHITE_LIST.find((i) => i.id === dappid), [dappid]);

  return (
    <AppFrame title={dApp?.name || ''} navigation={<BackButton />}></AppFrame>
  );
};

export default ConnectedDApp;
