import { useNavigate } from 'react-router-dom';

import BackButton from './BackButton';

const BackButtonRouter = () => {
  const navigate = useNavigate();
  return <BackButton onClick={() => navigate(-1)} />;
};

export default BackButtonRouter;
