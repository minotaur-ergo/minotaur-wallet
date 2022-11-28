import React from 'react';
import QrCodeReader from './reader/QrCodeReader';
import QrCodeMoreChunk from './qrcode-types/QrCodeMoreChunk';
import Types from './qrcode-types';
import crypto from 'crypto';
import { GlobalStateType } from '../../store/reducer';
import { connect, MapDispatchToProps } from 'react-redux';
import {
  AddQrCodeOpened,
  closeQrCodeScanner,
  showMessage,
} from '../../store/actions';
import { SnackbarMessage, VariantType } from 'notistack';
import { MessageEnqueueService } from '../app/MessageHandler';
import Wallet from '../../db/entities/Wallet';

interface QrCodeReaderViewPropsType extends MessageEnqueueService {
  success: (scanned: string) => unknown;
  fail: () => unknown;
  close: () => unknown;
  open: boolean;
  children: React.ReactNode;
  completed?: (result: string) => unknown;
  allowedTypes?: Array<string>;
  qrCodes: Array<string>;
  addQrcode: (id: string) => unknown;
  closeQrCode: (id: string) => unknown;
  wallet?: Wallet;
}

interface QrCodeReaderViewStateType {
  scanning: boolean;
  type: string;
  id: string;
  chunks: Array<string>;
  open: boolean;
}

class QrCodeReaderView extends React.Component<
  QrCodeReaderViewPropsType,
  QrCodeReaderViewStateType
> {
  state: QrCodeReaderViewStateType = {
    scanning: true,
    type: '',
    id: '',
    chunks: [],
    open: false,
  };

  updateOpen = () => {
    const qrCodeId = this.state.id
      ? this.state.id
      : crypto.randomBytes(8).toString('hex');
    if (this.state.open !== this.props.open) {
      this.setState({
        open: this.props.open,
        type: '',
        id: qrCodeId,
        chunks: [],
        scanning: true,
      });
      if (this.props.open) {
        if (this.props.qrCodes.indexOf(qrCodeId) <= -1) {
          this.props.addQrcode(qrCodeId);
        }
      } else {
        this.props.closeQrCode(qrCodeId);
      }
    } else {
      if (this.props.open && this.props.qrCodes.indexOf(qrCodeId) === -1) {
        this.props.close();
      }
    }
  };

  componentDidMount = () => {
    this.updateOpen();
  };

  componentDidUpdate = () => {
    this.updateOpen();
  };

  success = (scanned: string) => {
    let selectedTypes = Types.filter((item) => item.detect(scanned) !== null);
    if (this.props.allowedTypes) {
      const allowedTypes: Array<string> = this.props.allowedTypes;
      selectedTypes = selectedTypes.filter(
        (item) => allowedTypes.indexOf(item.type) >= 0
      );
    }
    if (selectedTypes.length > 0) {
      const selectedType = selectedTypes[0];
      const chunk = selectedType.detect(scanned);
      let chunks: Array<string> = [...this.state.chunks];
      const total = chunk?.total;
      const page = chunk?.page;
      if (total !== undefined && page !== undefined) {
        if (
          (selectedType.type !== this.state.type && this.state.type) ||
          page <= 0 ||
          page > total
        ) {
          this.props.showMessage('Invalid QRCODE scanned', 'error');
        } else {
          if (this.state.chunks.length === 0) {
            chunks = Array(total).fill('');
            if (chunk?.payload) {
              chunks[page - 1] = chunk?.payload;
            } else {
              /* empty */
            }
          } else {
            if (total !== chunks.length) {
              this.props.showMessage('Invalid QRCODE scanned', 'error');
            } else {
              if (chunk?.payload) {
                chunks[page - 1] = chunk?.payload;
              } else {
                /* empty */
              }
            }
          }
        }
      } else {
        /* empty */
      }
      this.setState({
        type: selectedType.type,
        chunks: chunks,
        scanning: false,
      });
    } else {
      this.props.success(scanned);
    }
  };

  renderSubComponent = () => {
    const selectedType = Types.filter((item) => item.type === this.state.type);
    if (selectedType.length > 0) {
      return selectedType[0].render(
        this.state.chunks.join(''),
        this.props.close,
        this.props.completed,
        this.props.wallet
      );
    }
    return null;
  };

  render = () => {
    const invalidChunkCount = this.state.chunks.filter((item) => !item).length;
    return (
      <React.Fragment>
        {!this.state.open ? null : this.state.scanning ? (
          <QrCodeReader
            closeQrCode={this.props.close}
            fail={this.props.fail}
            success={this.success}
          />
        ) : invalidChunkCount > 0 ? (
          <QrCodeMoreChunk
            chunks={this.state.chunks}
            close={this.props.close}
            scanNext={() => this.setState({ scanning: true })}
          />
        ) : (
          this.renderSubComponent()
        )}
        <div style={{ display: this.state.open ? 'none' : 'block' }}>
          {this.props.children}
        </div>
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state: GlobalStateType) => ({
  qrCodes: state.qrcode.pages,
});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
  addQrcode: (id: string) => dispatch(AddQrCodeOpened(id)),
  closeQrCode: (id: string) => dispatch(closeQrCodeScanner(id)),
  showMessage: (message: SnackbarMessage, variant: VariantType) =>
    dispatch(showMessage(message, variant)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QrCodeReaderView);
