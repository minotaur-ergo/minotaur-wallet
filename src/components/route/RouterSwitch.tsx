import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { App } from '@capacitor/app';
import { RouteMap } from './routerMap';
import { connect } from 'react-redux';
import { GlobalStateType } from '../../store/reducer';
import Home from '../pages/home/Home';
import WalletAdd from '../pages/wallet-add/WalletAdd';
import WalletPage from '../pages/wallet/WalletPage';
import { closeQrCodeScanner } from '../../store/actions';
import Settings from '../pages/settings/Settings';
import { Action, Dispatch } from 'redux';
// import DAppConnectorContainer from "../pages/dapp-connector/DAppConnectorContainer";
import DAppConnectorContainer from '../pages/dapp-connector/DAppConnectorContainer';

interface PropsType {
  qrCodes: Array<string>;
  closeQrcode: (id: string) => unknown;
}

class RouterSwitch extends React.Component<PropsType, never> {
  appBackButtonListener = () => {
    if (this.props.qrCodes.length > 0) {
      this.props.closeQrcode(this.props.qrCodes[this.props.qrCodes.length - 1]);
    } else {
      try {
        if (window.location.href === '/') {
          App.exitApp();
        } else {
          // TODO goback
          // this.props.history.goBack();
        }
      } catch (e) {
        App.exitApp();
      }
    }
  };
  componentDidMount = () => {
    App.addListener('backButton', this.appBackButtonListener);
  };

  render = () => {
    return (
      <React.Fragment>
        <div>
          <Routes>
            <Route path={RouteMap.Settings} element={<Settings />} />
            <Route
              path={RouteMap.DAppConnector}
              element={<DAppConnectorContainer />}
            />
            <Route path={RouteMap.Wallet} element={<WalletPage />} />
            <Route path={RouteMap.WalletAdd} element={<WalletAdd />} />
            <Route path={RouteMap.Home} element={<Home />} />
          </Routes>
        </div>
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state: GlobalStateType) => ({
  qrCodes: state.qrcode.pages,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  closeQrcode: (id: string) => dispatch(closeQrCodeScanner(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RouterSwitch);
