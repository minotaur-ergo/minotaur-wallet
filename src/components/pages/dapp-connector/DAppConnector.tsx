import React from 'react';
import {
  ActionType,
  AddressRequestPayload,
  BalanceRequestPayload,
  BoxRequestPayload,
  BoxResponsePayload,
  Connection,
  ConnectionData,
  ConnectionState,
  MessageContent,
  MessageData,
  Payload,
} from './types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
} from '@mui/material';
import { ConstructionOutlined, ExpandMore } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import WalletSelect from './WalletSelect';
import WalletWithErg from '../../../db/entities/views/WalletWithErg';
import * as CryptoJS from 'crypto-js';
import * as wasm from 'ergo-lib-wasm-browser';

import {
  AddressDbAction,
  BoxContentDbAction,
  BoxDbAction,
  WalletDbAction,
} from '../../../action/db';
import { ErgoBox } from '../../../util/network/models';
import { CoveringResult } from '../../../util/interface';

interface DAppConnectorPropType {
  value: string;
  clearValue: () => any;
}

interface DAppConnectorStateType {
  servers: { [url: string]: Connection };
  connections: Array<ConnectionState>;
  active: string;
}

class DAppConnector extends React.Component<
  DAppConnectorPropType,
  DAppConnectorStateType
> {
  state: DAppConnectorStateType = {
    servers: {},
    connections: [],
    active: '',
  };

  decrypt = (text: string, secret: string) => {
    const bytes = CryptoJS.AES.decrypt(text, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  encrypt = (text: string, secret: string) => {
    return CryptoJS.AES.encrypt(text, secret).toString();
  };

  handleError = (error: Event) => {
    /*empty*/
  };

  componentDidMount() {
    /*empty*/
  }

  processConfirmed = (connection: ConnectionState) => {
    this.setState((state) => {
      const newConnections = [...state.connections];
      const updatedConnections = newConnections.map((item) => {
        if (item.info.pageId === connection.info.pageId) {
          return { ...item, display: '' };
        }
        return item;
      });
      return { ...state, connections: updatedConnections };
    });
  };

  processAddress = async (
    connection: ConnectionState,
    content: MessageContent
  ) => {
    const payload = content.payload as AddressRequestPayload;
    const wallet = await WalletDbAction.getWalletById(connection.walletId!);
    if (wallet) {
      const addresses = await AddressDbAction.getWalletAddresses(wallet.id);
      let resultAddress: Array<string> = [];
      if (payload.type === 'change') {
        resultAddress = [addresses[0].address];
      } else {
        const usedAddressIds = (
          await BoxDbAction.getUsedAddressIds(`${wallet.id}`)
        ).map((item) => item.addressId);
        resultAddress = addresses
          .filter((item) => {
            const index = usedAddressIds.indexOf(item.id);
            return payload.type === 'used' ? index !== -1 : index === -1;
          })
          .map((item) => item.address);
        if (payload.page) {
          resultAddress = resultAddress.slice(
            payload.page.page * payload.page.limit,
            (payload.page.page + 1) * payload.page.limit
          );
        }
      }
      this.sendMessageToServer(
        connection,
        'address_response',
        content.requestId,
        resultAddress
      );
    }
  };

  processBalance = async (
    connection: ConnectionState,
    content: MessageContent
  ) => {
    const payload = content.payload as BalanceRequestPayload;
    const wallet = await WalletDbAction.getWalletWithErg(connection.walletId!);
    if (wallet) {
      const tokens = payload.tokens;
      const res: { [id: string]: string } = {};
      const amounts: { [id: string]: string } = {};
      (await BoxContentDbAction.getWalletTokens(wallet.id)).forEach((item) => {
        amounts[item.tokenId] = item.total;
      });
      tokens.forEach((token) => {
        if (token === 'ERG' || token === '') {
          res['ERG'] = wallet.erg().toString();
        } else {
          res[token] = Object.prototype.hasOwnProperty.call(amounts, token)
            ? amounts[token]
            : '0';
        }
      });
      this.sendMessageToServer(
        connection,
        'balance_response',
        content.requestId,
        res
      );
    }
  };

  processBoxes = async (
    connection: ConnectionState,
    content: MessageContent
  ) => {
    const payload = content.payload as BoxRequestPayload;
    const wallet = await WalletDbAction.getWalletWithErg(connection.walletId!);
    const resultUtxos: BoxResponsePayload = {
      boxes: [],
    };
    if (wallet) {
      const coveringAmount = payload.amount
        ? payload.amount
        : wallet.erg().toString();
      const coveringToken: { [id: string]: bigint } = {};
      if (payload.tokenId)
        coveringToken[payload.tokenId] = BigInt(coveringAmount);
      const result: CoveringResult = await BoxDbAction.getCoveringBoxFor(
        BigInt(coveringAmount),
        wallet.id,
        coveringToken
      );
      const ergoBoxes = result.covered ? result.boxes : undefined;
      if (ergoBoxes) {
        for (let index = 0; index < ergoBoxes.len(); index++) {
          resultUtxos.boxes!.push(ergoBoxes.get(index).to_js_eip12());
        }
      }
      //console.log(resultUtxos.boxes?.get(0).to_js_eip12())
      console.log(ergoBoxes);
      this.sendMessageToServer(
        connection,
        'boxes_response',
        content.requestId,
        resultUtxos
      );
    }
  };

  handleMessage = (msg: MessageData) => {
    const filteredConnections = this.state.connections.filter(
      (item) => item.info.pageId === msg.pageId
    );
    if (filteredConnections.length === 1) {
      const connection = filteredConnections[0];
      // const contentStr = this.decrypt(msg.content, connection.info.enc_key)
      const content: MessageContent = JSON.parse(msg.content);
      console.log(msg);
      switch (content.action) {
        case 'confirmed':
          this.processConfirmed(connection);
          break;
        case 'address_request':
          this.processAddress(connection, content).then(() => null);
          break;
        case 'balance_request':
          this.processBalance(connection, content).then(() => null);
          break;
        case 'boxes_request':
          this.processBoxes(connection, content).then(() => null);
          break;
      }
    }
  };

  sendMessageToServer = (
    connection: ConnectionState,
    action: ActionType,
    requestId: string,
    payload: Payload
  ) => {
    const serverAddress = connection.info.server;
    const server: Connection = this.state.servers[serverAddress];
    server.send(
      connection.info.id,
      connection.info.pageId,
      JSON.stringify({
        action: action,
        requestId: requestId,
        payload: payload,
      })
    );
  };

  sendConnectionToServer = (connection: ConnectionState) => {
    const serverAddress = connection.info.server;
    const server: Connection = Object.prototype.hasOwnProperty.call(
      this.state.servers,
      serverAddress
    )
      ? this.state.servers[serverAddress]
      : new Connection(serverAddress, this.handleError, this.handleMessage);
    server.send(
      connection.info.id,
      connection.info.pageId,
      JSON.stringify({
        action: 'confirm',
        requestId: connection.info.requestId,
        payload: {
          id: server.getId(),
          display: connection.display,
        },
      })
    );
    if (
      !Object.prototype.hasOwnProperty.call(this.state.servers, serverAddress)
    ) {
      this.setState((state) => ({
        ...state,
        servers: {
          ...state.servers,
          [serverAddress]: server,
        },
      }));
    }
  };

  componentDidUpdate = () => {
    if (this.props.value) {
      const info: ConnectionData = JSON.parse(
        this.props.value
      ) as ConnectionData;
      const current = this.state.connections.filter(
        (item) => item.info.pageId === info.pageId
      );
      if (current.length === 0) {
        this.setState((state) => ({
          ...state,
          connections: [
            {
              info: info,
              actions: [],
              display: '' + Math.floor(Math.random() * 899999 + 100000),
            },
            ...state.connections,
          ],
          active: info.pageId,
        }));
      } else {
        this.setState({ active: info.pageId });
      }
      this.props.clearValue();
    }
  };

  selectWallet = (index: number, selected: WalletWithErg) => {
    this.setState((state) => {
      const newConnection = [...state.connections];
      newConnection[index] = { ...newConnection[index] };
      newConnection[index].walletId = selected.id;
      this.sendConnectionToServer(newConnection[index]);
      return {
        ...state,
        connections: newConnection,
      };
    });
    // TODO send connection accepted to port
  };

  render = () => {
    return (
      <Container style={{ marginTop: 10 }}>
        {this.state.connections.map((connection, index) => (
          <Accordion
            key={connection.info.pageId}
            expanded={this.state.active === connection.info.pageId}
            onChange={() => this.setState({ active: connection.info.pageId })}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                <img
                  alt="fav-icon"
                  src={connection.info.favIcon}
                  style={{ width: 20, height: 20 }}
                />
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {connection.info.origin}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {connection.walletId ? (
                connection.display ? (
                  <Typography align="center">
                    Please View this code on connector
                    <span
                      style={{
                        letterSpacing: 8,
                        display: 'block',
                        padding: 10,
                      }}
                    >
                      <span
                        style={{
                          background: '#CDCDCD',
                          padding: 5,
                          fontWeight: 'bold',
                          fontSize: 20,
                          borderRadius: 10,
                        }}
                      >
                        {connection.display}
                      </span>
                    </span>
                    and verify it to connection be completed
                  </Typography>
                ) : (
                  <div>wallet selected</div>
                )
              ) : (
                <WalletSelect
                  select={(selected: WalletWithErg) =>
                    this.selectWallet(index, selected)
                  }
                />
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    );
  };
}

export default DAppConnector;
