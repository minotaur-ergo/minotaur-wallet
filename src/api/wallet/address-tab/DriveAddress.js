import React, { useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import TextInput from "../../../components/TextInput";
import { deriveAddress } from "../../../actions/address";
import { withRouter } from "react-router-dom";
import WithWallet from "../../../hoc/WithWallet";

const DriveAddress = props => {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const deriveNewAddress = () => {
    deriveAddress(props.wallet.id, props.wallet.mnemonic, password, name);
  }
  return (
    <Container style={{marginTop: 20, marginBottom: 20}}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextInput
            label="New Address Name"
            // error={this.validateName()}
            value={name}
            setValue={setName}/>
        </Grid>
        <Grid item xs={12}>
          <TextInput
            label="Wallet password"
            type="password"
            // error={this.validateName()}
            value={name}
            setValue={setName}/>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth onClick={() => deriveNewAddress()}>
            Derive new address
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default WithWallet(DriveAddress)
