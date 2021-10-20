import React from "react";
import { withRouter } from "react-router-dom";
import * as actionTypes from "../store/actionType";
import { connect } from "react-redux";

const WithWallet = (Component) => {
  const WithWalletComponent = props => {
    const wallets = props.wallets.filter(item => '' + item.id === '' + props.match.params.id);
    const wallet = wallets[0];
    return (
      <Component {...props} wallet={wallet}/>
    )
  }
  return connect(mapStateToProps)(withRouter(WithWalletComponent))

}

const mapStateToProps = state => ({
  wallets: state.wallets,
});

export default WithWallet
