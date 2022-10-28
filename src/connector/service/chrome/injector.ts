import { EventData } from '../types';
import * as uuid from 'uuid';
import setupErgo from './content';

const info: {
  sessionId: string;
  port?: chrome.runtime.Port;
} = {
  sessionId: uuid.v4(),
};

const getPort = () => {
  if (!info.port) {
    console.log('new port created');
    if (!info.sessionId) {
      info.sessionId = uuid.v4();
    }
    info.port = chrome.runtime.connect();
    info.port.onMessage.addListener((msg: EventData) => {
      if (msg.type === 'connected') {
        info.port?.postMessage({
          type: 'register',
        });
      } else {
        msg.sessionId = info.sessionId;
        window.postMessage(msg, window.location.origin);
      }
    });
    info.port.onDisconnect.addListener(() => {
      console.log('disconnected');
      info.port = undefined;
    });
  }
  return info.port;
};

// const injectScript = (file_path: string, tag: string) => {
//   const node = document.getElementsByTagName(tag)[0];
//   const script = document.createElement('script');
//   script.setAttribute('type', 'text/javascript');
//   script.setAttribute('src', file_path);
//   node.appendChild(script);
//   node.removeChild(script);
// };
//
// injectScript(chrome.runtime.getURL('scripts/content.js'), 'body');

window.addEventListener('message', (event: MessageEvent<EventData>) => {
  if (event.data.direction !== 'request') {
    return;
  }
  const data = { ...event.data, sessionId: info.sessionId };
  getPort().postMessage(data);
});

getPort();
setupErgo();
