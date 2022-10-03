import React from 'react';
import { QrCodePropsType } from './propsType';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ScanResult } from '@capacitor-community/barcode-scanner/dist/esm/definitions';
import { MessageEnqueueService } from '../../app/MessageHandler';
import { GlobalStateType } from '../../../store/reducer';
import { connect, MapDispatchToProps } from 'react-redux';
import { SnackbarMessage, VariantType } from 'notistack';
import { showMessage } from '../../../store/actions';

interface QrCodeReaderCapacitorPropsType
  extends QrCodePropsType,
    MessageEnqueueService {}

class QrCodeReaderCapacitor extends React.Component<
  QrCodeReaderCapacitorPropsType,
  never
> {
  checkPermission = async () => {
    // check or request permission
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (status.granted) {
      // the user granted permission
      return true;
    }

    return false;
  };
  start = async () => {
    if (await this.checkPermission()) {
      await BarcodeScanner.hideBackground();
      const result: ScanResult = await BarcodeScanner.startScan();
      if (result.hasContent && result.content) {
        this.props.handleScan(result.content);
      } else {
        this.props.handleError();
      }
    } else {
      this.props.showMessage('No permission to use camera', 'error');
    }
  };
  stop = async () => {
    await BarcodeScanner.stopScan();
    await BarcodeScanner.showBackground();
  };

  componentWillUnmount() {
    this.stop().then(() => null);
  }

  componentDidMount() {
    this.start()
      .then(() => null)
      .catch(() => this.props.handleError());
  }

  render = () => {
    return <div />;
  };
}

const mapStateToProps = (state: GlobalStateType) => ({});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
  showMessage: (message: SnackbarMessage, variant: VariantType) =>
    dispatch(showMessage(message, variant)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QrCodeReaderCapacitor);
