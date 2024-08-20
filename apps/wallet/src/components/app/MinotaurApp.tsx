import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { SafeArea } from 'capacitor-plugin-safe-area';
import createStyle from './safe-area-style';
import AppTheme from '../app-theme/AppTheme';
import Database from '../database/Database';
import MessageHandler from './MessageHandler';
import { MemoryRouter } from 'react-router-dom';
import AppRouter from '@/router/AppRouter';
import store from '@/store';
import { Provider } from 'react-redux';
import BackButtonHandler from '@/router/BackButtonHandler';
import QrCodeReaderView from '../qr-code-scanner/QrCodeReaderView';

const MinotaurApp = () => {
  const [style, setStyle] = useState('');
  useEffect(() => {
    if (Capacitor.getPlatform() === 'ios') {
      SafeArea.getSafeAreaInsets().then((inset) => {
        setStyle(createStyle(inset.insets.top, inset.insets.bottom));
      });
    }
  }, []);
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
