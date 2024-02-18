import React, { useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { App } from '@capacitor/app';

const handleBackButton = (navigate: NavigateFunction) => {
  if (window.location.href === '/') {
    App.exitApp().then(() => null);
  } else {
    navigate(-1);
  }
};

const BackButtonHandler = () => {
  const [back, setBack] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (back === '') {
      App.addListener('backButton', () => handleBackButton(navigate));
      setBack('completed');
    }
  }, [back, navigate]);
  return <React.Fragment />;
};

export default BackButtonHandler;
