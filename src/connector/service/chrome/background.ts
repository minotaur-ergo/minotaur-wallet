import {
    DEFAULT_SERVER, EventData,
    Session,
    UIMessage
} from "../types";
import * as uuid from "uuid";
import { generate } from "generate-password";
import {
    PostMessage,
    MessageData,
    decrypt,
    MessageContent,
    encrypt,
    APIErrorCode,
    AddressRequestPayload
} from "../../types";
import { BalanceRequestPayload, ConfirmPayload } from "../../types";

const info: {
    id: string;
    enc_key: string;
    sockets: { [url: string]: WebSocket };
    sessions: Map<string, Session>;
    ports: Array<chrome.runtime.Port>
} = {
    id: uuid.v4(),
    sockets: {},
    enc_key: generate({ length: 32, symbols: true, numbers: true, uppercase: true, lowercase: true }),
    sessions: new Map<string, Session>(),
    ports: []
};

const createSocket = (server: string): Promise<void> => {
    return new Promise((resolve) => {
        if (!info.sockets.hasOwnProperty(server)) {
            const socket = new WebSocket(server);
            socket.onclose = () => {
                if (info.sockets.hasOwnProperty(server)) {
                    delete info.sockets["server"];
                }
            };
            socket.onopen = () => {
                // send registration to server
                const msg: PostMessage = {
                    action: "register",
                    id: info.id
                };
                socket.send(JSON.stringify(msg));
            };
            socket.onmessage = (message: MessageEvent<string>) => {
                const msg = JSON.parse(message.data) as MessageData;
                if (msg.sender === "") {
                    resolve();
                } else {
                    const content = decrypt(msg.content, info.enc_key);
                    const session = info.sessions.get(content.pageId);
                    if (session && session.port) {
                        const request = session.requests.get(content.requestId);
                        if (request) {
                            switch (content.action) {
                                case "confirm":
                                    const payload = content.payload as ConfirmPayload;
                                    session.walletId = payload.id;
                                    session.popupPort?.postMessage({
                                        type: "set_display",
                                        display: payload.display
                                    });
                                    break;
                                case "address":
                                    // session.port.postMessage({
                                    //     type: 'call',
                                    //     direction: 'response',
                                    //     isSuccess: true,
                                    //     requestId: request.requestId,
                                    //     payload: contentJson.payload as AddressResponsePayload
                                    // });
                                    break;
                                case "balance":
                                    // session.port.postMessage({
                                    //     type: 'call',
                                    //     direction: 'response',
                                    //     isSuccess: true,
                                    //     requestId: request.requestId,
                                    //     payload: contentJson.payload as BalanceResponsePayload
                                    // })
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

chrome.runtime.onConnect.addListener(function(port) {
    info.ports.push(port);
    if (port.name === "minotaur") {
        console.log("this part used to display logs");
        // port.onMessage.addListener(uiHandleRequest)
    } else {
        console.log("new connection port arrived");
        // port.onMessage.addListener(handleAuthRequests)
        // port.onMessage.addListener(handleCallRequests)
        port.postMessage({ type: "connected" });
    }
});

const handleCallRequests = (msg: EventData, port: chrome.runtime.Port) => {
    if (msg.type === "call") {
        const session = info.sessions.get(msg.sessionId);
        if (session && session.port) {
            if (!session.walletId) {
                const sendMsg: EventData = {
                    type: "call",
                    function: msg.function,
                    sessionId: msg.sessionId,
                    direction: "response",
                    requestId: msg.requestId,
                    isSuccess: false,
                    payload: { code: APIErrorCode.Refused, info: "Wallet not connected" }
                };
                session.port.postMessage(sendMsg);
            } else {
                session.requests.set(`${msg.requestId}`, { ...msg });
                const fn = msg.function;
                switch (fn) {
                    case "address":
                        sendMessage(session.server, session.walletId, session.id, {
                            action: "address",
                            pageId: session.id,
                            payloadType: "AddressRequestPayload",
                            requestId: msg.requestId,
                            payload: msg.payload as AddressRequestPayload
                        });
                        break;
                    case "balance":
                        sendMessage(session.server, session.walletId, session.id, {
                            action: "balance",
                            pageId: session.id,
                            payloadType: "BalanceRequestPayload",
                            requestId: msg.requestId,
                            payload: msg.payload as BalanceRequestPayload
                        });
                }
            }
        }
    }
};


const sendMessage = (server: string, id: string, pageId: string, content: MessageContent) => {
    const contentStr = encrypt(content, info.enc_key);
    const msg: PostMessage = {
        action: "send",
        user: id,
        content: contentStr
    };
    if (info.sockets.hasOwnProperty(server)) {
        info.sockets[server].send(JSON.stringify(msg));
    }
};

// const handleAuthRequests = (msg: EventData, port: chrome.runtime.Port) => {
//     if (msg.type === 'auth') {
//         let session = info.sessions.get(msg.sessionId)
//         if (!session) {
//             session = {
//                 port: port,
//                 id: msg.sessionId,
//                 server: msg.payload && msg.payload.hasOwnProperty('address') ? msg.payload.address as string : DEFAULT_SERVER,
//                 requests: new Map<string, EventData>(),
//                 requestId: `${msg.requestId}`,
//             }
//             info.sessions.set(msg.sessionId, session)
//             port.onDisconnect.addListener(() => {
//                 if (session) {
//                     session.port = undefined;
//                 }
//             });
//         }
//         session.requests.set(`${msg.requestId}`, {...msg})
//         const fn = msg.function;
//         switch (fn) {
//             case 'connect':
//                 session.requests.set(`${msg.requestId}`, msg);
//                 requestAccess(session, msg.requestId)
//                 break;
//             case 'is_connected':
//                 session.port?.postMessage({
//                     type: 'auth',
//                     direction: 'response',
//                     isSuccess: true,
//                     requestId: msg.requestId,
//                     payload: !!session.walletId,
//                 });
//                 break;
//         }
//     }
// }
//
// const uiHandleRequest = (msg: UIMessage, port: chrome.runtime.Port) => {
//     const session = info.sessions.get(msg.id)
//     if (session) {
//         switch (msg.type) {
//             case 'register':
//                 session.popupPort = port;
//                 port.postMessage({type: "registered"})
//                 break;
//             case "get_params":
//                 createSocket(session.server).then(() => {
//                     let url = session.port?.sender?.tab?.url!;
//                     url = url.split("://")[1];
//                     url = url.split("/")[0];
//                     const favIconUrl = session.port?.sender?.tab?.favIconUrl ? session.port.sender.tab.favIconUrl : "";
//                     session.popupPort?.postMessage({
//                         type: "set_info",
//                         info: {
//                             server: session.server,
//                             id: info.id,
//                             requestId: session.requestId,
//                             enc_key: info.enc_key,
//                             pageId: session.id,
//                             origin: url,
//                             favIcon: favIconUrl,
//                         }
//                     });
//                 })
//                 break;
//             case "approve":
//                 const request = session.requests.get(`${msg.requestId!}`);
//                 if (request) {
//                     session.port?.postMessage({
//                         type: 'auth',
//                         direction: 'response',
//                         isSuccess: true,
//                         requestId: request.requestId,
//                     });
//                     session.popupPort?.postMessage({type: "close"});
//                     sendMessage(session.server, session.walletId!, session.id, JSON.stringify({action: "confirmed"}))
//                 }
//         }
//     }
// }
//
// const requestAccess = (session: Session, requestId: string) => {
//     chrome.windows.create({
//         focused: true,
//         width: 450,
//         height: 600,
//         type: 'panel',
//         url: `index.html?id=${session.id}&requestId=${requestId}`
//     }).then(() => null);
// }