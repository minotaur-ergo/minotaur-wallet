import { useEffect, useState } from 'react';
import ConnectStart from './ConnectStart';
import { UIResponse } from './service/chrome/types';

interface ConnectPropsType {
  pageId: string;
  requestId: string | null;
}

const port = chrome.runtime.connect({
  name: 'minotaur',
});

const Connect = (props: ConnectPropsType) => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [server, setServer] = useState('');
  const [encKey, setEncKey] = useState('');
  const [id, setId] = useState('');
  const [origin, setOrigin] = useState('');
  const [display, setDisplay] = useState('');
  const [favIcon, setFavIcon] = useState('');
  useEffect(() => {
    port.onMessage.addListener((msg: UIResponse) => {
      switch (msg.type) {
        case 'set_info': {
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
          setLoaded(true);
          setLoading(false);
          break;
        }
        case 'registered': {
          port.postMessage({ id: props.pageId, type: 'get_params' });
          break;
        }
        case 'close': {
          window.close();
          break;
        }
        case 'set_display': {
          setDisplay(msg.display!);
          break;
        }
      }
      // setWalletKey(msg.params)
    });
    if (!loaded && !loading) {
      setLoading(true);
      port.postMessage({ id: props.pageId, type: 'register' });
    }
  }, [loaded, loading, props.pageId]);
  const connection = {
    server: server,
    id: id,
    requestId: props.requestId,
    enc_key: encKey,
    pageId: props.pageId,
    origin: origin ? origin : '',
    favIcon: favIcon ? favIcon : '',
  };
  return (
    <ConnectStart
      code={JSON.stringify(connection)}
      url={origin}
      favIcon={favIcon}
    />
  );
};

export default Connect;
