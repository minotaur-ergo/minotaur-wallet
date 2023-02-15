import { EventData, Session, UIMessage } from '../types';
import * as uuid from 'uuid';
import { generate } from 'generate-password';
import {
  AddressResponsePayload,
  BalanceResponsePayload,
  BoxResponsePayload,
  ConfirmPayload,
  MessageContent,
  MessageData,
  SignDataResponsePayload,
  SignTxInputResponsePayload,
  SignTxResponsePayload,
  SubmitTxResponsePayload,
} from '../../../components/pages/dapp-connector/types/types';

const DEFAULT_SERVER = 'ws://127.0.0.1:6486';
const info: {
  id: string;
  enc_key: string;
  sockets: { [url: string]: WebSocket };
  sessions: Map<string, Session>;
  ports: Array<chrome.runtime.Port>;
} = {
  id: uuid.v4(),
  sockets: {},
  enc_key: generate({
    length: 32,
    symbols: true,
    numbers: true,
    uppercase: true,
    lowercase: true,
  }),
  sessions: new Map<string, Session>(),
  ports: [],
};

const createSocket = (server: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!Object.prototype.hasOwnProperty.call(info.sockets, server)) {
      const socket = new WebSocket(server);
      socket.onclose = () => {
        console.log('socket closed');
        if (Object.prototype.hasOwnProperty.call(info.sockets, server)) {
          delete info.sockets['server'];
        }
      };
      socket.onopen = () => {
        console.log('socket opened');
        // send registration to server
        socket.send(
          JSON.stringify({
            action: 'register',
            payload: {
              id: info.id,
            },
          })
        );
      };
      socket.onmessage = (message: MessageEvent<string>) => {
        console.log(`new message from server ${message.data}`);
        const content = JSON.parse(message.data) as MessageData;
        if (content.sender === '') {
          resolve();
        } else {
          const session = info.sessions.get(content.pageId);
          if (session && session.port) {
            const contentJson = JSON.parse(content.content) as MessageContent;
            const request = session.requests.get(contentJson.requestId);
            if (request) {
              switch (contentJson.action) {
                case 'confirm':
                  session.walletId = (contentJson.payload as ConfirmPayload).id;
                  session.popupPort?.postMessage({
                    type: 'set_display',
                    display: (contentJson.payload as ConfirmPayload).display,
                  });
                  break;
                case 'address_response':
                  session.port.postMessage({
                    type: 'call',
                    direction: 'response',
                    isSuccess: true,
                    requestId: request.requestId,
                    payload: contentJson.payload as AddressResponsePayload,
                  });
                  break;
                case 'balance_response':
                  session.port.postMessage({
                    type: 'call',
                    direction: 'response',
                    isSuccess: true,
                    requestId: request.requestId,
                    payload: contentJson.payload as BalanceResponsePayload,
                  });
                  break;
                case 'boxes_response':
                  session.port.postMessage({
                    type: 'call',
                    direction: 'response',
                    isSuccess: true,
                    requestId: request.requestId,
                    payload: contentJson.payload as BoxResponsePayload,
                  });
                  break;
                case 'sign_response':
                  session.port.postMessage({
                    type: 'call',
                    direction: 'response',
                    isSuccess: true,
                    requestId: request.requestId,
                    payload: contentJson.payload as SignTxResponsePayload,
                  });
                  break;
                case 'submit_response':
                  session.port.postMessage({
                    type: 'call',
                    direction: 'response',
                    isSuccess: true,
                    requestId: request.requestId,
                    payload: contentJson.payload as SubmitTxResponsePayload,
                  });
                  break;
                case 'sign_data_response':
                  session.port.postMessage({
                    type: 'call',
                    direction: 'response',
                    isSuccess: true,
                    requestId: request.requestId,
                    payload: contentJson.payload as SignDataResponsePayload,
                  });
                  break;
                case 'sign_tx_input_response':
                  session.port.postMessage({
                    type: 'call',
                    direction: 'response',
                    isSuccess: true,
                    requestId: request.requestId,
                    payload: contentJson.payload as SignTxInputResponsePayload,
                  });
                  break;
              }
            }
          }
        }
      };
      info.sockets[server] = socket;
    } else {
      resolve();
    }
  });
};

const sendMessage = (
  server: string,
  id: string,
  pageId: string,
  content: string
) => {
  const msg = {
    action: 'send',
    payload: {
      client: id,
      pageId: pageId,
      content: content,
    },
  };
  console.log('msg: ', msg);
  if (Object.prototype.hasOwnProperty.call(info.sockets, server)) {
    console.log('socket found');
    info.sockets[server].send(JSON.stringify(msg));
  }
};

const handleAuthRequests = (msg: EventData, port: chrome.runtime.Port) => {
  if (msg.type === 'auth') {
    let session = info.sessions.get(msg.sessionId);
    if (!session) {
      session = {
        port: port,
        id: msg.sessionId,
        server:
          msg.payload &&
          Object.prototype.hasOwnProperty.call(msg.payload, 'address')
            ? (msg.payload.address as string)
            : DEFAULT_SERVER,
        requests: new Map<string, EventData>(),
        requestId: `${msg.requestId}`,
      };
      info.sessions.set(msg.sessionId, session);
      port.onDisconnect.addListener((port: chrome.runtime.Port) => {
        if (session) {
          session.port = undefined;
        }
      });
    }
    session.requests.set(`${msg.requestId}`, { ...msg });
    const fn = msg.function;
    console.log(`function call information ${JSON.stringify(msg)}`);
    switch (fn) {
      case 'connect':
        session.requests.set(`${msg.requestId}`, msg);
        requestAccess(session, msg.requestId);
        break;
      case 'is_connected':
        session.port?.postMessage({
          type: 'auth',
          direction: 'response',
          isSuccess: true,
          requestId: msg.requestId,
          payload: !!session.walletId,
        });
        break;
    }
  }
};

const handleCallRequests = (msg: EventData, port: chrome.runtime.Port) => {
  if (msg.type === 'call') {
    const session = info.sessions.get(msg.sessionId);
    if (session && session.port) {
      if (!session.walletId) {
        session.port.postMessage({
          type: 'call',
          direction: 'response',
          isSuccess: false,
          payload: 'Wallet not connected',
          requestId: msg.requestId,
        });
      } else {
        session.requests.set(`${msg.requestId}`, { ...msg });
        const fn = msg.function;
        switch (fn) {
          case 'address':
            sendMessage(
              session.server,
              session.walletId,
              session.id,
              JSON.stringify({
                action: 'address_request',
                requestId: msg.requestId,
                payload: msg.payload,
              })
            );
            break;
          case 'balance':
            sendMessage(
              session.server,
              session.walletId,
              session.id,
              JSON.stringify({
                action: 'balance_request',
                requestId: msg.requestId,
                payload: msg.payload,
              })
            );
            break;
          case 'boxes':
            sendMessage(
              session.server,
              session.walletId,
              session.id,
              JSON.stringify({
                action: 'boxes_request',
                requestId: msg.requestId,
                payload: msg.payload,
              })
            );
            break;
          case 'sign':
            sendMessage(
              session.server,
              session.walletId,
              session.id,
              JSON.stringify({
                action: 'sign_request',
                requestId: msg.requestId,
                payload: msg.payload,
              })
            );
            break;
          case 'submit':
            sendMessage(
              session.server,
              session.walletId,
              session.id,
              JSON.stringify({
                action: 'submit_request',
                requestId: msg.requestId,
                payload: msg.payload,
              })
            );
            break;
          case 'signData':
            sendMessage(
              session.server,
              session.walletId,
              session.id,
              JSON.stringify({
                action: 'sign_data_request',
                requestId: msg.requestId,
                payload: msg.payload,
              })
            );
            break;
          case 'signTxInput':
            sendMessage(
              session.server,
              session.walletId,
              session.id,
              JSON.stringify({
                action: 'sign_tx_input_request',
                requestId: msg.requestId,
                payload: msg.payload,
              })
            );
            break;
        }
      }
    }
  }
};

const uiHandleRequest = (msg: UIMessage, port: chrome.runtime.Port) => {
  const session = info.sessions.get(msg.id);
  console.log(`UI message is ${JSON.stringify(msg)}`);
  if (session) {
    switch (msg.type) {
      case 'register': {
        session.popupPort = port;
        port.postMessage({ type: 'registered' });
        break;
      }
      case 'get_params': {
        createSocket(session.server).then(() => {
          let url = session.port?.sender?.tab?.url;
          if (url != undefined) {
            url = url.split('://')[1];
            url = url.split('/')[0];
          }
          const favIconUrl = session.port?.sender?.tab?.favIconUrl
            ? session.port.sender.tab.favIconUrl
            : '';
          session.popupPort?.postMessage({
            type: 'set_info',
            info: {
              server: session.server,
              id: info.id,
              requestId: session.requestId,
              enc_key: info.enc_key,
              pageId: session.id,
              origin: url,
              favIcon: favIconUrl,
            },
          });
        });
        break;
      }
      case 'approve': {
        const request = session.requests.get(`${msg.requestId!}`);
        if (request) {
          session.port?.postMessage({
            type: 'auth',
            direction: 'response',
            isSuccess: true,
            requestId: request.requestId,
          });
          session.popupPort?.postMessage({ type: 'close' });
          sendMessage(
            session.server,
            session.walletId!,
            session.id,
            JSON.stringify({ action: 'confirmed' })
          );
        }
      }
    }
  }
};

chrome.runtime.onConnect.addListener(function (port) {
  info.ports.push(port);
  if (port.name === 'minotaur') {
    console.log('this part used to display logs');
    port.onMessage.addListener(uiHandleRequest);
  } else {
    console.log('new connection port arrived');
    port.onMessage.addListener(handleAuthRequests);
    port.onMessage.addListener(handleCallRequests);
    port.postMessage({ type: 'connected' });
  }
});

const requestAccess = (session: Session, requestId: string) => {
  chrome.windows
    .create({
      focused: true,
      width: 450,
      height: 600,
      type: 'panel',
      url: `index.html?id=${session.id}&requestId=${requestId}`,
    })
    .then((window) => null);
};
