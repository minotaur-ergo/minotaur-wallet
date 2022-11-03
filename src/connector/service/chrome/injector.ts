import { EventData } from '../types';
import * as uuid from 'uuid';

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

function shouldInject() {
  const documentElement = document.documentElement.nodeName;
  const docElemCheck = documentElement
    ? documentElement.toLowerCase() === 'html'
    : true;
  const { doctype } = window.document;
  const docTypeCheck = doctype ? doctype.name === 'html' : true;
  return docElemCheck && docTypeCheck;
}

const injectScript = (file_path: string) => {
  console.log(file_path);
  const container = document.head || document.documentElement;
  const script = document.createElement('script');
  script.setAttribute('async', 'false');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file_path);
  container.insertBefore(script, container.children[0]);
  // node.appendChild(script);
  // node.removeChild(script);
};

if (shouldInject()) {
  injectScript(chrome.runtime.getURL('scripts/content.js'));
} else {
  console.log('inject not allowed');
}

window.addEventListener('message', (event: MessageEvent<EventData>) => {
  if (event.data.direction !== 'request') {
    return;
  }
  const data = { ...event.data, sessionId: info.sessionId };
  getPort().postMessage(data);
});

getPort();
