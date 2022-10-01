import React, { useEffect, useState } from 'react';
import Connect from '../connect/Connect';
import './App.css';
import { UIResponse } from '../../service/types';

const port = chrome.runtime.connect({
  name: 'minotaur',
});

function App() {
  const pageId = new URLSearchParams(window.location.search).get('id');
  const requestId = new URLSearchParams(window.location.search).get(
    'requestId'
  );
  const [server, setServer] = useState('');
  const [encKey, setEncKey] = useState('');
  const [id, setId] = useState('');
  const [origin, setOrigin] = useState('');
  const [display, setDisplay] = useState('');
  const [favIcon, setFavIcon] = useState('');
  useEffect(() => {
    console.log('we are here to set port listener');
    port.onMessage.addListener((msg: UIResponse) => {
      console.log('ui listener: ', msg);
      switch (msg.type) {
        case 'set_info':
          const info = msg.info!;
          setId(info.id);
          setServer(info.server);
          setEncKey(info.enc_key);
          if (info.origin) {
            setOrigin(info.origin);
          }
          if (info.favIcon) {
            setFavIcon(info.favIcon);
          }
          break;
        case 'registered':
          port.postMessage({ id: pageId, type: 'get_params' });
          break;
        case 'close':
          window.close();
          break;
        case 'set_display':
          console.log('on set display');
          setDisplay(msg.display!);
          break;
      }
      // setWalletKey(msg.params)
    });
    port.postMessage({ id: pageId, type: 'register' });
  }, []);
  const confirm = () => {
    console.log('confirmed');
    port.postMessage({ id: pageId, type: 'approve', requestId: requestId });
  };
  return (
    <div className="App">
      {pageId ? (
        <Connect
          enc_key={encKey}
          id={id}
          origin={origin}
          favIcon={favIcon}
          requestId={requestId}
          display={display}
          pageId={pageId}
          confirm={confirm}
          server={server}
        />
      ) : null}
    </div>
  );
}

export default App;
