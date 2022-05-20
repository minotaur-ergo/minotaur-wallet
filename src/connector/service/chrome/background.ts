import { DEFAULT_SERVER, EventData, Session, UIMessage, UIResponse } from "../types";
import * as uuid from "uuid";
import { generate } from "generate-password";
import { APIErrorCode } from "../../types/errors";
import {
    AddressRequestPayload,
    BalanceRequestPayload,
    BoxRequestPayload, ConfirmPayload,
    ConnectPayload,
    SingTxRequestPayload
} from "../../types/payloads";
import { MessageContent, MessageData, PostMessage } from "../../types/communication";
import { decrypt, encrypt } from "../../utils";

const info: {
    id: string;
    enc_key: string;
    sockets: { [url: string]: WebSocket };
    sessions: Map<string, Session>;
} = {
    id: uuid.v4(),
    sockets: {},
    enc_key: generate({ length: 32, symbols: true, numbers: true, uppercase: true, lowercase: true }),
    sessions: new Map<string, Session>()
};

const createSocket = (server: string): Promise<void> => {
    return new Promise((resolve, reject) => {
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
                console.log(message)
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
                                    const msg: UIResponse = {
                                        type: "set_display",
                                        display: payload.display
                                    };
                                    session.popupPort?.postMessage(msg);
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
            socket.onerror = (err) => {
                console.log(err)
                reject("Can't connect to server");
            };
            info.sockets[server] = socket;
        } else {
            resolve();
        }
    });
};

chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === "minotaur") {
        console.log("this part used to display logs");
        port.onMessage.addListener(uiHandleRequest);
    } else {
        console.log("new connection port arrived");
        port.onMessage.addListener(handleAuthRequests);
        port.onMessage.addListener(handleCallRequests);
        const msg: EventData = {
            direction: "response",
            function: "connect",
            isSuccess: true,
            requestId: "",
            sessionId: "",
            type: "register"
        };
        port.postMessage(msg);
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
                        break;
                    case "boxes":
                        sendMessage(session.server, session.walletId, session.id, {
                            action: "boxes",
                            pageId: session.id,
                            payloadType: "BoxRequestPayload",
                            requestId: msg.requestId,
                            payload: msg.payload as BoxRequestPayload
                        });
                        break;
                    case "sign":
                        sendMessage(session.server, session.walletId, session.id, {
                            action: "sign",
                            pageId: session.id,
                            payloadType: "",
                            requestId: msg.requestId,
                            payload: msg.payload as SingTxRequestPayload
                        });
                        break;
                    case "sign_data":
                        break;
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

const handleAuthRequests = (msg: EventData, port: chrome.runtime.Port) => {
    if (msg.type === "auth") {
        let session = info.sessions.get(msg.sessionId);
        if (!session) {
            const payload = msg.payload as ConnectPayload;
            session = {
                port: port,
                id: msg.sessionId,
                server: payload.server ? payload.server : DEFAULT_SERVER,
                requests: new Map<string, EventData>(),
                requestId: `${msg.requestId}`
            };
            info.sessions.set(msg.sessionId, session);
            port.onDisconnect.addListener(() => {
                if (session) {
                    session.port = undefined;
                }
            });
        }
        session.requests.set(`${msg.requestId}`, { ...msg });
        const fn = msg.function;
        switch (fn) {
            case "connect":
                session.requests.set(`${msg.requestId}`, msg);
                requestAccess(session, msg.requestId);
                break;
            case "is_connected":
                session.port?.postMessage({
                    type: "auth",
                    direction: "response",
                    isSuccess: true,
                    requestId: msg.requestId,
                    payload: !!session.walletId
                });
                break;
        }
    }
};

const uiHandleRequest = (msg: UIMessage, port: chrome.runtime.Port) => {
    const session = info.sessions.get(msg.id);
    if (session) {
        switch (msg.type) {
            case "register":
                session.popupPort = port;
                port.postMessage({ type: "registered" });
                break;
            case "get_params":
                createSocket(session.server).then(() => {
                    let url = session.port?.sender?.tab?.url!;
                    url = url.split("://")[1];
                    url = url.split("/")[0];
                    const favIconUrl = session.port?.sender?.tab?.favIconUrl ? session.port.sender.tab.favIconUrl : "";
                    const msg: UIResponse = {
                        type: "set_info",
                        info: {
                            server: session.server,
                            id: info.id,
                            requestId: session.requestId,
                            enc_key: info.enc_key,
                            pageId: session.id,
                            origin: url,
                            favIcon: favIconUrl
                        }
                    };
                    session.popupPort?.postMessage(msg);
                }).catch((err) => {
                    const msg: UIResponse = {
                        type: "set_error",
                        error: "" + err
                    };
                    session.popupPort?.postMessage(msg);
                });
                break;
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
        }
    }
};

const requestAccess = (session: Session, requestId: string) => {
    chrome.windows.create({
        focused: true,
        width: 450,
        height: 600,
        type: "panel",
        url: `index.html?id=${session.id}&requestId=${requestId}`
    }).then(() => null);
};