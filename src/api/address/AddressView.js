import React, { useEffect, useState } from 'react'
import WithAppBar from "../../layout/WithAppBar";
import WalletHeader from "../../hoc/WalletHeader";
import { Container } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { filterAddress } from "../../db/web/address";
import QrCode from "qrcode.react";

const WalletAdd = props => {
  const [address, setAddress] = useState("")
  useEffect(() => {
    filterAddress(props.match.params.address_id).then(address => setAddress(address))
  }, [])
  return (
    <WithAppBar header={<WalletHeader title="Add Wallet"/>}>
      <Container style={{textAlign: "center"}}>
        <div style={{margin: 20}}>{address.name}</div>
        {address ? <QrCode value={address.address} size={256}/> : null}
        <div style={{margin: 20, wordWrap: "break-word"}}>{address.address}</div>
      </Container>
    </WithAppBar>
  )
}


export default withRouter(WalletAdd);
