import React, { useEffect } from 'react'
import { Container } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import QrCode from "qrcode.react";
import WalletHeader from "../../../layout/WalletHeader";
import WithAppBar from "../../../layout/WithAppBar";
import { connect } from "react-redux";
import { loadAddresses } from "../../../store/action";
import WithWallet from "../../../layout/WithWallet";

const WalletAdd = props => {
  useEffect(() => loadAddresses(props.wallet))
  const addresses = props.address.filter(item => "" + item.id === "" + props.match.params.address_id)
  const address = addresses && addresses.length >= 1 ? addresses[0] : {}
  return (
    <WithAppBar header={<WalletHeader title={address.name}/>}>
      {address ? (
        <Container style={{textAlign: "center"}}>
          <div style={{margin: 20}}>{address.name}</div>
          {address && address.address ? <QrCode value={address.address} size={256}/> : null}
          <div style={{margin: 20, wordWrap: "break-word"}}>{address.address}</div>
        </Container>
      ) : null}
    </WithAppBar>
  )
}

const mapStateToProps = state => ({
  address: state.address
})


export default connect(mapStateToProps)(WithWallet(withRouter(WalletAdd)));
