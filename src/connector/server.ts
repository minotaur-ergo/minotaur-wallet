import * as WebSocket from "websocket";
import * as http from "http";
import { Client } from "./types/server";
import { MessageData, PostMessage } from "./types/communication";

const webSocketsServerPort = 6486;
const clients: { [id: string]: Client } = {};

const server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
server.listen(webSocketsServerPort, "0.0.0.0", function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

const wsServer = new WebSocket.server({
    httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on("request", function(request) {
    console.log((new Date()) + " Connection from origin " + request.origin + ".");

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    let connection = request.accept(null, request.origin);
    console.log((new Date()) + " Connection accepted.");
    let myInfo = {
        id: "",
        connection: connection
    };
    // user sent some message
    connection.on("message", function(messageObj) {
        if (messageObj.type === "utf8") { // accept only text
            try {
                const message: PostMessage = JSON.parse(messageObj.utf8Data) as PostMessage;
                if (message.action === "register") {
                    // register new client
                    // const payload = message.payload as RegisterMessage
                    clients[message.id!] = {
                        id: message.id!,
                        connection: connection
                    };
                    myInfo.id = message.id!;
                    const response: MessageData = {
                        sender: "",
                        content: "registered"
                    };
                    connection.sendUTF(JSON.stringify(response));
                } else if (message.action === "send") {
                    const client = message.user;
                    if (client && clients.hasOwnProperty(client)) {
                        const clientConnection = clients[client]!;
                        console.log((new Date()) + " New message from " + request.origin + " to " + clientConnection.id);
                        const clientMessage: MessageData = {
                            sender: myInfo.id,
                            content: message.content!
                        }
                        clientConnection.connection.sendUTF(JSON.stringify(clientMessage));
                    } else {
                        console.log((new Date()) + " New message from " + request.origin + " declined.");
                        const response: MessageData = {
                            sender: "decline",
                            content: message.content? message.content : ""
                        }
                        myInfo.connection.sendUTF(JSON.stringify(response));
                    }
                }
            } catch (exp) {

            }
        }
    });

    // user disconnected
    connection.on("close", function(connection) {
        if (myInfo.id) {
            console.log(`${new Date()} Peer ${myInfo.id} disconnected`);
            delete clients[myInfo.id];
        }
    });
});
