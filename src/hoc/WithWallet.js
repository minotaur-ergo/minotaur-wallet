import React from "react";
import { withRouter } from "react-router-dom";
import { Wallets } from "../const";

const WithWallet = (Component) => {
  const WithWalletComponent = props => {
    const wallets = Wallets.filter(item => '' + item.id === '' + props.match.params.id);
    const wallet = wallets[0]
    return (
      <Component {...props} wallet={wallet}/>
    )
  }
  return withRouter(WithWalletComponent)
}

export default WithWallet;
