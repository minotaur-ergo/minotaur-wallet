import React, { useEffect, useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import TextInput from "../../../components/TextInput";
// import { deriveAddress } from "../../../actions/address";
import WithWallet from "../../../layout/WithWallet";
import { deriveNewAddress, validateWalletPassword } from "../../../db/action/Address";
// import WithWallet from "../../../hoc/WithWallet";

const DriveAddress = props => {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  useEffect(() => {
    if(password) {
      validateWalletPassword(props.wallet, password).then(isValid => setPasswordError(isValid ? "" : "Password is incorrect"))
    }else{
      setPasswordError("Password is required")
    }
  }, [password])
  const deriveAddress = () => {
    deriveNewAddress(props.wallet, password, name).then(() => {
    })
  }
  return (
    <Container style={{marginTop: 20, marginBottom: 20}}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextInput
            label="New Address Name"
            error={name === '' ? "Name is required" : ""}
            value={name}
            setValue={setName}/>
        </Grid>
        <Grid item xs={12}>
          <TextInput
            label="Wallet password"
            type="password"
            error={passwordError}
            value={password}
            setValue={setPassword}/>
        </Grid>
        <Grid item xs={12}>
          <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={passwordError !== "" && name !== ""}
              onClick={() => deriveAddress()}>
            Derive new address
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default WithWallet(DriveAddress)
