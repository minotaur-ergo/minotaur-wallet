import React from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { QrCodePropsType } from './propsType';
import AppHeader from '../../app-header/AppHeader';
import WithAppBar from '../../../layout/WithAppBar';
import { Result } from '@zxing/library';
import { connect } from 'react-redux';
import { SnackbarMessage, VariantType } from 'notistack';
import { showMessage } from '../../../store/actions';
import { MessageEnqueueService } from '../../app/MessageHandler';
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Action, Dispatch } from 'redux';

interface QrCodeWebStateType {
  videoInputDevices: Array<MediaDeviceInfo>;
  selectedDeviceId: string;
  control: IScannerControls | null;
}

interface QrCodeWebPropsType extends QrCodePropsType, MessageEnqueueService {
  closeQrcode: () => unknown;
}

const codeReader = new BrowserQRCodeReader();

class QrCodeReaderWeb extends React.Component<
  QrCodeWebPropsType,
  QrCodeWebStateType
> {
  videoRef: React.RefObject<HTMLVideoElement>;

  state: QrCodeWebStateType = {
    videoInputDevices: [],
    selectedDeviceId: '',
    control: null,
  };

  constructor(props: QrCodeWebPropsType) {
    super(props);
    this.videoRef = React.createRef<HTMLVideoElement>();
  }

  componentDidMount = () => {
    BrowserQRCodeReader.listVideoInputDevices()
      .then((videoInputDevices) => {
        if (videoInputDevices.length >= 1) {
          this.setState({
            videoInputDevices: videoInputDevices,
            selectedDeviceId: videoInputDevices[0].deviceId,
          });
        } else {
          this.props.showMessage('No Video device found', 'error');
          this.props.closeQrcode();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  handleScan = (
    result: Result | undefined | null,
    error: Error | undefined | null
  ) => {
    if (result) {
      this.props.handleScan(result.getText());
    } else {
      console.log(error);
    }
  };

  componentDidUpdate = () => {
    if (this.videoRef.current) {
      if (!this.state.control) {
        codeReader
          .decodeFromVideoDevice(
            this.state.selectedDeviceId,
            this.videoRef.current,
            this.handleScan
          )
          .then((control) => {
            this.setState({ control: control });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  componentWillUnmount = () => {
    console.error('salam khare raftim to phaze unmount');
    if (this.state.control) {
      console.log('inja mikhaym stopesh koonim');
      this.state.control.stop();
    }
  };

  render = () => {
    return (
      <WithAppBar
        header={
          <AppHeader
            hideQrCode={true}
            title="Scan Qrcode"
            back={this.props.closeQrcode}
          />
        }
      >
        <Container style={{ marginTop: 10, marginBottom: 10 }}>
          <FormControl fullWidth>
            <InputLabel id="video-device-select">Select Vide Device</InputLabel>
            <Select
              value={this.state.selectedDeviceId}
              labelId="video-device-select"
              label="Select Video Device"
              onChange={(event) =>
                this.setState({ selectedDeviceId: event.target.value })
              }
            >
              {this.state.videoInputDevices.map((videoDevice) => (
                <MenuItem
                  key={videoDevice.deviceId}
                  value={videoDevice.deviceId}
                >
                  {videoDevice.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Container>
        <div>
          <video ref={this.videoRef} width="100%" height="100%" />
        </div>
      </WithAppBar>
    );
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  showMessage: (message: SnackbarMessage, variant: VariantType) =>
    dispatch(showMessage(message, variant)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QrCodeReaderWeb);
