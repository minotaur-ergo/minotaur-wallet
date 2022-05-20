import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Container } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import WalletSelect from "./WalletSelect";
import WalletWithErg from "../../../db/entities/views/WalletWithErg";
import { Connection, ConnectionData, ConnectionState } from "./types";
import { ActionType, MessageContent, MessageData } from "../../../connector/types/communication";
import { decrypt } from "../../../connector/utils";
import { AddressRequestPayload, Payload } from "../../../connector/types/payloads";
import { AddressDbAction, BoxDbAction, WalletDbAction } from "../../../action/db";
import { EventData } from "../../../connector/service/types";

interface DAppConnectorPropType {
    value: string;
    clearValue: () => any;
}

interface DAppConnectorStateType {
    servers: { [url: string]: Connection };
    connections: Array<ConnectionState>;
    active: string;
}

class DAppConnector extends React.Component<DAppConnectorPropType, DAppConnectorStateType> {
    state: DAppConnectorStateType = {
        servers: {},
        connections: [],
        active: ""
    };

    selectWallet = (index: number, selected: WalletWithErg) => {
        this.setState(state => {
            let newConnection = [...state.connections];
            newConnection[index] = { ...newConnection[index] };
            newConnection[index].walletId = selected.id;
            const newState = this.connectToServer(state, newConnection[index]);
            return {
                ...newState,
                connections: newConnection
            };
        });
    };

    connectToServer = (state: DAppConnectorStateType, connection: ConnectionState): DAppConnectorStateType => {
        const serverAddress = connection.info.server;
        let server: Connection = this.state.servers.hasOwnProperty(serverAddress) ? this.state.servers[serverAddress] : new Connection(
            serverAddress,
            this.handleError,
            this.handleMessage
        );
        server.send(connection.info.id, connection.info.enc_key, {
            action: "confirm",
            requestId: connection.info.requestId,
            pageId: connection.info.pageId,
            payloadType: 'ConfirmPayload',
            payload: {
                id: server.getId(),
                display: connection.display
            }
        });
        if (!this.state.servers.hasOwnProperty(serverAddress)) {
            return {
                ...state,
                servers: {
                    ...state.servers,
                    [serverAddress]: server
                }
            };
        }
        return state;
    };

    handleMessage = (msg: MessageData) => {
        const filteredConnections = this.state.connections.filter(item => item.info.id === msg.sender);
        if (filteredConnections.length >= 1) {
            const connection = filteredConnections[0];
            const content: MessageContent = decrypt(msg.content, connection.info.enc_key);
            switch (content.action) {
                case "confirm":
                    this.processConfirmed(connection);
                    break;
                case "address":
                    this.processAddress(connection, content).then(() => null);
                    break;
                // case "balance_request":
                //     this.processBalance(connection, content).then(() => null);
            }
        }
    }

    sendMessageToServer = (connection: ConnectionState, action: ActionType, requestId: string, payloadType: string, payload: Payload) => {
        const serverAddress = connection.info.server;
        let server: Connection = this.state.servers[serverAddress];
        const body: MessageContent = {
            pageId: connection.info.pageId,
            payload: payload,
            payloadType: payloadType,
            action: action,
            requestId: requestId
        }
        server.send(connection.info.id, connection.info.enc_key, body);
    };

    handleError = () => {

    }

    processAddress = async (connection: ConnectionState, content: MessageContent) => {
        const payload = content.payload as AddressRequestPayload;
        const wallet = await WalletDbAction.getWalletById(connection.walletId!);
        if (wallet) {
            const addresses = await AddressDbAction.getWalletAddresses(wallet.id);
            let resultAddress: Array<string> = [];
            if (payload.type === "change") {
                resultAddress = [addresses[0].address];
            } else {
                const usedAddressIds = (await BoxDbAction.getUsedAddressIds(`${wallet.id}`)).map(item => item.addressId);
                resultAddress = addresses.filter(item => {
                    const index = usedAddressIds.indexOf(item.id);
                    return payload.type === "used" ? index !== -1 : index === -1;
                }).map(item => item.address);
                if (payload.page) {
                    resultAddress = resultAddress.slice(payload.page.page * payload.page.limit, (payload.page.page + 1) * payload.page.limit);
                }
            }
            this.sendMessageToServer(connection, "address", content.requestId, "AddressResponsePayload", resultAddress);
        }
    };

    processConfirmed = (connection: ConnectionState) => {
        this.setState(state => {
            const newConnections = [...state.connections];
            const updatedConnections = newConnections.map(item => {
                if (item.info.pageId === connection.info.pageId) {
                    return { ...item, display: "" };
                }
                return item;
            });
            return { ...state, connections: updatedConnections };
        });
    };

    componentDidUpdate = () => {
        if (this.props.value) {
            debugger
            const info: ConnectionData = JSON.parse(this.props.value) as ConnectionData;
            const current = this.state.connections.filter(item => item.info.pageId === info.pageId);
            if (current.length === 0) {
                this.setState(state => ({
                    ...state,
                    connections: [{
                        info: info,
                        actions: [],
                        display: "" + Math.floor(Math.random() * 899999 + 100000)
                    }, ...state.connections],
                    active: info.pageId
                }));
            } else {
                this.setState({ active: info.pageId });
            }
            this.props.clearValue();
        }
    };

    render = () => {
        return (
            <Container style={{ marginTop: 10 }}>
                {this.state.connections.map((connection, index) => (
                    <Accordion
                        key={connection.info.pageId}
                        expanded={this.state.active === connection.info.pageId}
                        onChange={() => this.setState({ active: connection.info.pageId })}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography sx={{ width: "33%", flexShrink: 0 }}>
                                <img alt="fav-icon" src={connection.info.favIcon} style={{ width: 20, height: 20 }} />
                            </Typography>
                            <Typography sx={{ color: "text.secondary" }}>{connection.info.origin}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {connection.walletId ? connection.display ? (
                                <Typography align="center">
                                    Please View this code on connector
                                    <span style={{ letterSpacing: 8, display: "block", padding: 10 }}>
                                        <span style={{
                                            background: "#CDCDCD",
                                            padding: 5,
                                            fontWeight: "bold",
                                            fontSize: 20,
                                            borderRadius: 10
                                        }}>
                                            {connection.display}
                                        </span>
                                    </span>
                                    and verify it to connection be completed
                                </Typography>
                            ) : (
                                <div>wallet selected</div>
                            ) : (
                                <WalletSelect select={(selected: WalletWithErg) => this.selectWallet(index, selected)}/>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Container>
        );
    };
}

export default DAppConnector;