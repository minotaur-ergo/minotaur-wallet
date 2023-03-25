import React from 'react';
import { MessageEnqueueService } from '../app/MessageHandler';
import Wallet from '../../db/entities/Wallet';
import { GlobalStateType } from '../../store/reducer';
import { connect } from 'react-redux';
import {
  AddQrCodeOpened,
  closeQrCodeScanner,
  showMessage,
} from '../../store/actions';
import { SnackbarMessage, VariantType } from 'notistack';
import { Alert, Button, Divider, Grid } from '@mui/material';
import * as wasm from 'ergo-lib-wasm-browser';
import { MultiSigAction } from '../../action/action';
import {
  AddressDbAction,
  MultiSigDbAction,
  MultiStoreDbAction,
} from '../../action/db';
import RenderPassword from './RenderPassword';
import ShareCommitmentMultiSig from './ShareCommitmentMultiSig';
import { getNetworkType, NETWORK_TYPES } from '../../util/network_type';
import { PUBLISH_MANUAL_TYPES } from './PublishManualType';
import { BlockChainAction } from '../../action/blockchain';
import MultiSigDataReader from './MultiSigDataReader';
import ShareTransactionMultiSig from './ShareTransactionMultiSig';
import PublishedTxView from '../PublishedTxView';
import { Action, Dispatch } from 'redux';
import TxView from '../display-tx/TxView';
import Loading from '../loading/Loading';
import MultiSignRow from '../../db/entities/multi-sig/MultiSignRow';
import ReactLoading from 'react-loading';
import { MultiSigTxType } from '../../db/entities/multi-sig/MultiSignTx';

interface MultiSigSignProcessPropsType extends MessageEnqueueService {
  close: () => unknown;
  wallet: Wallet;
  tx: wasm.ReducedTransaction;
  boxes: wasm.ErgoBoxes;
  wallets: Array<Wallet>;
  commitments?: Array<Array<string>>;
  saved?: (instance: MultiSignRow) => unknown;
  highlight?: boolean;
  encryptedSecrets?: Array<Array<string>>;
  hideTx?: boolean;
  partial?: wasm.Transaction;
  signed?: Array<string>;
  simulated?: Array<string>;
  row?: MultiSignRow;
}

interface MultiSigSignProcessStatesType {
  password: string;
  txId: string;
  loading: boolean;
  txBytes: string;
  boxes: Array<string>;
  myHints?: {
    own: wasm.TransactionHintsBag;
    known: wasm.TransactionHintsBag;
  };
  commitments: Array<Array<string>>;
  error: string;
  relatedWallet?: Wallet;
  publishType: PUBLISH_MANUAL_TYPES;
  partial?: string;
  partialTx?: wasm.Transaction;
  simulated?: Array<string>;
  signed?: Array<string>;
  mySign: boolean;
  propsLoaded: boolean;
  qrCode: string;
  publishedId: string;
  addresses: Array<string>;
  loadedWallet: number;
  saving: boolean;
  changed: boolean;
}

interface InputData {
  tx: string;
  boxes: Array<string>;
  commitments: Array<Array<string>>;
  signed?: Array<string>;
  simulated?: Array<string>;
  partialTx?: string;
}

class MultiSigSignProcess extends React.Component<
  MultiSigSignProcessPropsType,
  MultiSigSignProcessStatesType
> {
  state: MultiSigSignProcessStatesType = {
    changed: false,
    saving: false,
    password: '',
    error: '',
    txId: '',
    txBytes: '',
    commitments: [],
    boxes: [],
    loading: false,
    publishType: PUBLISH_MANUAL_TYPES.clipboard,
    mySign: false,
    propsLoaded: false,
    qrCode: '',
    publishedId: '',
    addresses: [],
    loadedWallet: -1,
  };

  updateTransaction = async () => {
    const tx = this.props.tx;
    const txId = tx.unsigned_tx().id().to_str();
    if (this.state.txId !== txId && !this.state.loading) {
      this.setState({ loading: true });
      const txBytes = Buffer.from(tx.sigma_serialize_bytes()).toString(
        'base64'
      );
      const boxes = Array(this.props.boxes.len())
        .fill('')
        .map((item, index) => {
          return Buffer.from(
            this.props.boxes.get(index).sigma_serialize_bytes()
          ).toString('base64');
        });
      const partialBytes = this.props.partial
        ? Buffer.from(this.props.partial.sigma_serialize_bytes()).toString(
            'base64'
          )
        : undefined;
      const myPks = await this.getMyInputPks();
      const mySign = this.props.signed
        ? this.props.signed.filter((item) => myPks.indexOf(item) !== -1)
            .length > 0
        : false;
      this.setState({
        txId: txId,
        boxes: boxes,
        signed:
          this.props.signed && this.props.signed.length > 0
            ? this.props.signed
            : undefined,
        simulated:
          this.props.signed && this.props.signed.length > 0
            ? this.props.simulated
              ? this.props.simulated
              : []
            : undefined,
        txBytes: txBytes,
        mySign: mySign,
        partial: partialBytes,
        partialTx: this.props.partial ? this.props.partial : undefined,
        loading: false,
        changed: !this.state.saving,
      });
    }
  };

  updateCommitments = async (newCommitments?: Array<Array<string>>) => {
    let commitments = this.state.commitments.map((item) => [...item]);
    let changed = false;
    if (this.props.commitments && !this.state.propsLoaded) {
      const override = MultiSigAction.overridePublicCommitments(
        commitments,
        this.props.commitments
      );
      commitments = override.commitments;
      changed = changed ? changed : override.changed;
    }
    if (newCommitments) {
      const override = MultiSigAction.overridePublicCommitments(
        commitments,
        newCommitments
      );
      commitments = override.commitments;
      changed = changed ? changed : override.changed;
    }
    if (this.state.myHints && !this.state.mySign) {
      const known = await this.getKnownCommitments(this.state.myHints.known);
      const overrideKnown = MultiSigAction.overridePublicCommitments(
        commitments,
        known
      );
      commitments = overrideKnown.commitments;
      changed = changed ? changed : overrideKnown.changed;
    }
    if (changed) {
      this.setState({
        commitments: commitments,
        propsLoaded: true,
        changed: true,
      });
    }
  };

  updateQrCode = async () => {
    const tx = this.state.txBytes;
    const boxes = JSON.stringify(this.state.boxes);
    const commitments = JSON.stringify(this.state.commitments);
    let res = `{"tx":"${tx}","boxes":${boxes},"commitments":${commitments}`;
    if (this.state.partial) {
      const partial = this.state.partial;
      const simulated = JSON.stringify(await this.getSimulated());
      const signed = JSON.stringify(this.state.signed);
      res += `,"simulated":${simulated},"signed":${signed},"partialTx":"${partial}"`;
    }
    res += '}';
    if (this.state.qrCode !== res) {
      this.setState({ qrCode: res });
    }
  };

  getInputMap = async (): Promise<{ [boxId: string]: string }> => {
    const networkPrefix = getNetworkType(this.props.wallet.network_type).prefix;
    return Object.assign(
      {},
      ...Array(this.props.boxes.len())
        .fill('')
        .map((item, index) => {
          const box = this.props.boxes.get(index);
          const address = wasm.Address.recreate_from_ergo_tree(
            box.ergo_tree()
          ).to_base58(networkPrefix);
          return { [box.box_id().to_str()]: address };
        })
    );
  };

  getInputPks = async (): Promise<Array<Array<string>>> => {
    if (this.props.wallet && this.state.relatedWallet) {
      const pks = await MultiSigAction.getMultiSigWalletPublicKeys(
        this.props.wallet,
        this.state.relatedWallet
      );
      const tx = this.props.tx;
      const inputMap = await this.getInputMap();
      return Array(tx.unsigned_tx().inputs().len())
        .fill('')
        .map((item, index) => {
          return tx.unsigned_tx().inputs().get(index);
        })
        .map((box) => inputMap[box.box_id().to_str()])
        .map((address) => [...pks[address]]);
    }
    return [];
  };

  getMyInputPks = async (): Promise<Array<string>> => {
    if (this.props.wallet && this.state.relatedWallet) {
      const pks = await MultiSigAction.getMultiSigWalletMyPublicKeys(
        this.props.wallet,
        this.state.relatedWallet
      );
      const tx = this.props.tx;
      const inputMap = await this.getInputMap();
      return Array(tx.unsigned_tx().inputs().len())
        .fill('')
        .map((item, index) => {
          return tx.unsigned_tx().inputs().get(index);
        })
        .map((box) => inputMap[box.box_id().to_str()])
        .map((address) => pks[address]);
    }
    return [];
  };

  getKnownCommitments = async (commitment: wasm.TransactionHintsBag) => {
    const inputPKs = await this.getInputPks();
    return MultiSigAction.commitmentToByte(commitment, inputPKs);
  };

  commitmentCount = () => {
    if (this.state.commitments.length === 0) {
      return 0;
    }
    return Math.min(
      ...this.state.commitments.map(
        (boxCommitments) => boxCommitments.filter((item) => !!item).length
      )
    );
  };

  acceptPassword = async (password: string) => {
    if (this.state.relatedWallet) {
      if (
        this.commitmentCount() + (this.state.myHints ? 0 : 1) >=
        parseInt(this.props.wallet.seed)
      ) {
        await this.signTx(password);
      } else {
        await this.addCommitments(password);
      }
    }
  };

  addCommitments = async (password: string) => {
    if (this.state.relatedWallet) {
      if (!this.state.myHints) {
        const tx = this.props.tx;
        const wallet = await MultiSigAction.getMultiSigWalletProver(
          this.props.wallet,
          this.state.relatedWallet,
          password
        );
        const commitment = await MultiSigAction.generateCommitments(wallet, tx);
        const known = await this.getKnownCommitments(commitment.public);
        this.setState((state) => {
          const updateDict = {
            ...state,
            password: password,
            myHints: {
              own: commitment.private,
              known: commitment.public,
            },
            changed: true,
          };
          const commitments = state.commitments;
          if (commitments.length !== known.length) {
            return { ...updateDict, commitments: known };
          }
          const finalCommitments = MultiSigAction.overridePublicCommitments(
            commitments,
            known
          );
          return { ...updateDict, commitments: finalCommitments.commitments };
        });
      }
    }
  };

  getSimulated = async (): Promise<Array<string>> => {
    if (this.state.simulated) return this.state.simulated;
    const myPks = await this.getMyInputPks();
    const inputPks = await this.getInputPks();
    const res: Array<string> = [];
    inputPks.forEach((pkRow, rowIndex) => {
      const commitments = this.state.commitments[rowIndex];
      pkRow.forEach((pk, pkIndex) => {
        if (!commitments[pkIndex] && myPks.indexOf(pk) === -1) {
          res.push(pk);
        }
      });
    });
    return res;
  };

  removeSignedCommitments = (
    publicKeys: Array<Array<string>>,
    myPKs: Array<string>
  ) => {
    return this.state.commitments.map((commitmentRow, rowIndex) => {
      const rowPks = publicKeys[rowIndex];
      return commitmentRow.map((commitment, pkIndex) => {
        const pk = rowPks[pkIndex];
        if (
          (this.state.signed && this.state.signed.indexOf(pk) >= 0) ||
          myPKs.indexOf(pk) >= 0
        ) {
          return '';
        }
        return commitment;
      });
    });
  };

  decryptSecret = async (password: string) => {
    if (this.props.encryptedSecrets) {
      const publicKeys = await this.getInputPks();
      const extractedCommitments = MultiSigAction.getSecretHintBag(
        publicKeys,
        this.state.commitments,
        this.props.encryptedSecrets,
        password
      );
      const commitment = MultiSigAction.extractCommitments(
        extractedCommitments,
        this.props.tx.unsigned_tx().inputs().len()
      );
      this.setState({
        password: password,
        myHints: {
          own: commitment.private,
          known: commitment.public,
        },
        changed: true,
      });
    }
  };

  signTx = async (password: string) => {
    if (this.state.relatedWallet) {
      const simulated = await this.getSimulated();
      const publicKeys = await this.getInputPks();
      const myPks = await this.getMyInputPks();
      const commitments = this.removeSignedCommitments(publicKeys, myPks);
      const publicHintBag = MultiSigAction.getHintBags(publicKeys, commitments);
      if (this.state.signed && this.state.signed.length > 0) {
        const simulatedPropositions = new wasm.Propositions();
        simulated.forEach((item) => {
          simulatedPropositions.add_proposition_from_byte(
            Uint8Array.from(Buffer.from('cd' + item, 'hex'))
          );
        });
        const realPropositions = new wasm.Propositions();
        this.state.signed.forEach((item) => {
          realPropositions.add_proposition_from_byte(
            Uint8Array.from(Buffer.from('cd' + item, 'hex'))
          );
        });
        const context = await BlockChainAction.createContext(
          this.state.relatedWallet.network_type
        );
        if (this.state.partialTx) {
          const partial = this.state.partialTx;
          const hints = wasm.extract_hints(
            partial,
            context,
            this.props.boxes,
            wasm.ErgoBoxes.empty(),
            realPropositions,
            simulatedPropositions
          );
          Array(this.props.tx.unsigned_tx().inputs().len())
            .fill('')
            .forEach((item, index) => {
              const inputHints = hints.all_hints_for_input(index);
              publicHintBag.add_hints_for_input(index, inputHints);
              if (this.state.myHints) {
                const myOwnInputHints =
                  this.state.myHints.own.all_hints_for_input(index);
                publicHintBag.add_hints_for_input(index, myOwnInputHints);
              }
            });
        }
      }
      const tx = this.props.tx;
      const wallet = await MultiSigAction.getMultiSigWalletProver(
        this.props.wallet,
        this.state.relatedWallet,
        password
      );
      let partial = '';
      const partialSigned = wallet.sign_reduced_transaction_multi(
        tx,
        publicHintBag
      );
      partial = Buffer.from(partialSigned.sigma_serialize_bytes()).toString(
        'base64'
      );
      this.setState({
        simulated: simulated,
        signed: [...myPks, ...(this.state.signed ? this.state.signed : [])],
        partial: partial,
        partialTx: partialSigned,
        mySign: true,
        password: password,
        commitments: commitments,
      });
    }
  };

  loadJson = (jsonStr: string) => {
    try {
      const data: InputData = JSON.parse(jsonStr) as InputData;
      if (Object.prototype.hasOwnProperty.call(data, 'partialTx')) {
        if (data.tx === this.state.txBytes && data.partialTx) {
          const partial = wasm.Transaction.sigma_parse_bytes(
            Uint8Array.from(Buffer.from(data.partialTx, 'base64'))
          );
          this.setState({
            commitments: data.commitments,
            signed: data.signed ? data.signed : [],
            partialTx: partial,
            partial: Buffer.from(partial.sigma_serialize_bytes()).toString(
              'base64'
            ),
            simulated: data.simulated ? data.simulated : [],
            mySign: false,
            changed: true,
          });
        } else {
          this.props.showMessage('Invalid Data entered', 'error');
        }
      } else {
        if (data.tx === this.state.txBytes) {
          this.updateCommitments(data.commitments).then(() => null);
        } else {
          this.props.showMessage('Invalid Data entered', 'error');
        }
      }
    } catch (e) {
      this.props.showMessage('Invalid data entered', 'error');
    }
  };

  publishTx = () => {
    if (this.state.partial) {
      const tx = wasm.Transaction.sigma_parse_bytes(
        Uint8Array.from(Buffer.from(this.state.partial, 'base64'))
      );
      getNetworkType(
        this.state.relatedWallet ? this.state.relatedWallet.network_type : ''
      )
        .getNode()
        .sendTx(tx)
        .then((res) => {
          this.setState({ publishedId: res.txId });
        });
    }
  };

  updateData = () => {
    if (!this.state.relatedWallet) {
      MultiSigDbAction.getWalletInternalKey(this.props.wallet.id).then(
        (wallet) => {
          if (wallet) {
            this.setState({ relatedWallet: wallet });
          } else {
            this.setState({ error: 'related wallet not found!!' });
          }
        }
      );
    } else {
      this.updateTransaction().then(() => null);
      this.updateCommitments().then(() => null);
      this.updateQrCode().then(() => null);
      this.loadAddresses().then(() => null);
    }
  };

  loadAddresses = async () => {
    if (
      this.state.addresses.length === 0 ||
      this.state.loadedWallet !== this.props.wallet.id
    ) {
      const walletId = this.props.wallet.id;
      const addresses = (
        await AddressDbAction.getWalletAddresses(walletId)
      ).map((item) => item.address);
      this.setState({
        addresses: addresses,
        loadedWallet: walletId,
      });
    }
  };

  componentDidMount = () => {
    this.updateData();
  };

  componentDidUpdate = () => {
    this.updateData();
  };

  getNetworkType = () => {
    if (this.state.relatedWallet) {
      return getNetworkType(this.state.relatedWallet?.network_type);
    }
    return NETWORK_TYPES[0];
  };

  getBoxes = () => {
    const boxes: Array<wasm.ErgoBox> = [];
    Array(this.props.boxes.len())
      .fill('')
      .forEach((item, index) => {
        boxes.push(this.props.boxes.get(index));
      });
    return boxes;
  };

  storeAll = async () => {
    if (!this.state.saving) {
      this.setState({ saving: true });
      setTimeout(async () => {
        const row = await MultiStoreDbAction.insertMultiSigRow(
          this.props.wallet,
          this.state.txId
        );
        if (row) {
          // Generate secret list
          const inputPKs = await this.getInputPks();
          const secretStr: Array<Array<string>> = this.state.myHints
            ? MultiSigAction.commitmentToByte(
                this.state.myHints.own,
                inputPKs,
                true
              )
            : [];
          const secret = secretStr.map((row) =>
            row.map((item) => Buffer.from(item, 'base64'))
          );
          await MultiStoreDbAction.insertMultiSigInputs(row, this.state.boxes);
          await MultiStoreDbAction.insertMultiSigTx(
            row,
            this.state.txBytes,
            MultiSigTxType.Reduced
          );
          if (this.state.partial) {
            await MultiStoreDbAction.insertMultiSigTx(
              row,
              this.state.partial,
              MultiSigTxType.Partial
            );
          }
          await MultiStoreDbAction.insertMultiSigCommitments(
            row,
            this.state.commitments,
            secret,
            this.state.password
          );
          if (this.state.signed && this.state.simulated) {
            await MultiStoreDbAction.insertMultiSigSigner(
              row,
              this.state.signed,
              this.state.simulated
            );
          }
          if (this.props.saved) {
            this.props.saved(row);
          }
          this.setState({ saving: false, changed: false });
        }
      }, 100);
    }
  };

  render = () => {
    const secretCount = this.props.encryptedSecrets
      ? this.props.encryptedSecrets.filter((row) => {
          return row.filter((element) => element.length > 0).length > 0;
        }).length
      : 0;
    return (
      <Grid container spacing={2} style={{ textAlign: 'center' }}>
        {this.props.hideTx ? null : (
          <Grid item xs={12}>
            {this.state.addresses.length > 0 && this.props.tx ? (
              <TxView
                network_type={this.props.wallet.network_type}
                tx={this.props.tx.unsigned_tx()}
                boxes={this.getBoxes()}
                addresses={this.state.addresses}
              />
            ) : (
              <Loading />
            )}
            <Divider />
          </Grid>
        )}
        {this.state.error ? (
          <Alert severity="error">An error occurred: {this.state.error}</Alert>
        ) : this.state.publishedId ? (
          <PublishedTxView
            txId={this.state.publishedId}
            networkType={this.getNetworkType()}
          />
        ) : this.state.mySign ? (
          <ShareTransactionMultiSig
            remainCount={this.commitmentCount()}
            required={parseInt(this.props.wallet.seed)}
            publishTx={() => this.publishTx()}
            commitment={this.state.qrCode}
          />
        ) : this.state.partialTx ? (
          <React.Fragment>
            {this.state.password ? (
              <Grid xs={12} item>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={() => this.signTx(this.state.password)}
                >
                  Process Sign transaction
                </Button>
              </Grid>
            ) : (
              <RenderPassword
                action="Process Sign Transaction"
                accept={(password) => this.signTx(password)}
                wallet={this.state.relatedWallet!}
                title="Enter wallet password to process signing transaction"
              />
            )}
          </React.Fragment>
        ) : this.state.myHints ? (
          <ShareCommitmentMultiSig
            count={this.commitmentCount()}
            required={parseInt(this.props.wallet.seed)}
            commitment={this.state.qrCode}
          />
        ) : this.state.relatedWallet ? (
          <React.Fragment>
            {secretCount > 0 ? (
              <RenderPassword
                action="Load Saved Commitment"
                accept={(password) => this.decryptSecret(password)}
                wallet={this.state.relatedWallet}
                title="Enter wallet password to decrypt secret content for transaction"
              />
            ) : (
              <RenderPassword
                action="Create Commitment"
                accept={(password) => this.acceptPassword(password)}
                wallet={this.state.relatedWallet}
              />
            )}
          </React.Fragment>
        ) : null}
        {this.state.mySign ? (
          <Grid xs={12} item>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={() => this.props.close()}
            >
              Completed
            </Button>
          </Grid>
        ) : !!this.state.partial || !this.state.myHints ? null : (
          <Grid xs={12} item>
            <MultiSigDataReader
              newData={(data: string) => this.loadJson(data)}
            />
          </Grid>
        )}
        <Grid item xs={6}>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            disabled={!this.state.changed}
            // disabled={(!this.state.password || this.props.saved === undefined)}
            onClick={this.storeAll}
          >
            {this.state.saving ? (
              <React.Fragment>
                <ReactLoading
                  type="spin"
                  color="#000"
                  width="20px"
                  height="20px"
                />{' '}
                &nbsp;
              </React.Fragment>
            ) : null}
            {this.props.row ? 'Update' : 'Save'}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={this.props.close}
          >
            Cancel & Delete
          </Button>
          <Divider />
        </Grid>
      </Grid>
    );
  };
}

const mapStateToProps = (state: GlobalStateType) => ({
  wallets: state.wallet.wallets,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  addQrcode: (id: string) => dispatch(AddQrCodeOpened(id)),
  closeQrCode: (id: string) => dispatch(closeQrCodeScanner(id)),
  showMessage: (message: SnackbarMessage, variant: VariantType) =>
    dispatch(showMessage(message, variant)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MultiSigSignProcess);
