import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Stack,
  Typography,
} from '@mui/material';
import MinotaurLogo from '../../../splash/MinotaurLogo';
import ExtensionFrame from './ExtensionFrame';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouterMap } from '../../V2Demo';

function generateRandomCode() {
  let c = '';
  for (let i = 0; i < 6; i++) {
    c += Math.floor(Math.random() * 10);
  }
  return c;
}

function shuffleArray(array: string[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export default function ExtensionConnector() {
  const [options, setOptions] = useState<[] | string[]>([]);
  const [code, setCode] = useState<'' | string>('');
  const isConfirmed = useMemo(() => code.length > 0, [code]);
  const navigate = useNavigate();

  const getCode = () => {
    const correctCode = generateRandomCode();
    setCode(correctCode);
    formOptions(correctCode);
  };

  const formOptions = (answer: string) => {
    setOptions(
      shuffleArray([answer, generateRandomCode(), generateRandomCode()])
    );
  };

  const handleConfirmCode = (word: string) => () => {
    if (word === code) {
      navigate(RouterMap.Extension);
    } else {
      getCode();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getCode();
    }, 2000);
  }, []);

  return (
    <ExtensionFrame
      title="dApp Extension Connector"
      navigation={<MinotaurLogo style={{ width: '40px' }} />}
    >
      {isConfirmed ? (
        <>
          <Typography mb={3}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Typography>
          <Stack spacing={3} sx={{ width: '50%', mx: 'auto' }}>
            {options.map((word, index) => (
              <Card key={index}>
                <CardActionArea sx={{ p: 2 }} onClick={handleConfirmCode(word)}>
                  <Typography
                    textAlign="center"
                    letterSpacing="0.4rem"
                    fontSize="1.5rem"
                  >
                    {word}
                  </Typography>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        </>
      ) : (
        <>
          <Avatar sx={{ mx: 'auto', width: 64, height: 64 }}>
            <WidgetsRoundedIcon />
          </Avatar>
          <Typography textAlign="center" mt={2} mb={4} px={2}>
            URL Lorem ipsum dolor sit amet consectetur adipiscing elit
          </Typography>
          <Typography variant="body2">
            Describe more here if needed. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </Typography>
          <Box sx={{ p: 8, textAlign: 'center', fontStyle: 'italic' }}>
            _QR CODE_
          </Box>
          <Typography textAlign="center" mb={2}>
            Scan QR code
          </Typography>
          <Typography textAlign="center">or</Typography>
          <Button variant="text">Connect local system</Button>
        </>
      )}
    </ExtensionFrame>
  );
}
