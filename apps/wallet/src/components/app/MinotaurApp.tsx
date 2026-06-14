import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { SafeArea } from 'capacitor-plugin-safe-area';

import { useDeviceTheme } from '@/hooks/useDeviceTheme';
import AppRouter from '@/router/AppRouter';
import BackButtonHandler from '@/router/BackButtonHandler';
import store from '@/store';

import AppTheme from '../app-theme/AppTheme';
import Database from '../database/Database';
import QrCodeReaderView from '../qr-code-scanner/QrCodeReaderView';
import MessageHandler from './MessageHandler';
import createStyle from './safe-area-style';

const MinotaurApp = () => {
  const [style, setStyle] = useState('');
  const deviceTheme = useDeviceTheme();
  useEffect(() => {
    const setBackgroundColor = async (color: string, style: Style) => {
      await EdgeToEdge.setBackgroundColor({ color });
      await StatusBar.setStyle({ style });
    };
    const platform = Capacitor.getPlatform();
    if (platform === 'ios') {
      SafeArea.getSafeAreaInsets().then((inset) => {
        setStyle(createStyle(inset.insets.top, inset.insets.bottom));
      });
    } else if (platform === 'android') {
      setBackgroundColor(
        deviceTheme === 'dark' ? '#000000' : '#FFFFFF',
        deviceTheme === 'dark' ? Style.Dark : Style.Light,
      );
    }
  }, [deviceTheme]);
  return (
    <AppTheme>
      <MessageHandler>
        <style type="text/css">{style}</style>
        <Database>
          <Provider store={store}>
            <MemoryRouter>
              <QrCodeReaderView>
                <BackButtonHandler />
                <AppRouter />
              </QrCodeReaderView>
            </MemoryRouter>
          </Provider>
        </Database>
      </MessageHandler>
    </AppTheme>
  );
};

export default MinotaurApp;
