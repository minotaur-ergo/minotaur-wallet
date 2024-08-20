import BackButton from './BackButton';
import { useNavigate } from 'react-router-dom';

const BackButtonRouter = () => {
  const navigate = useNavigate();
  return <BackButton onClick={() => navigate(-1)} />;
};

export default BackButtonRouter;
