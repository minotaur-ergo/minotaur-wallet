import React, { useState } from "react";
import { Button, Container, Divider, Grid } from "@material-ui/core";
import AddressSelector from "./AddressSelector";
import ReceiverRow from "./ReceiverRow";
import PasswordInput from "../../../components/PasswordInput";
import { getWalletBox } from "../../../db/commands/box";
import * as wasm from 'ergo-lib-wasm-browser'

const SendTab = props => {
  const [receivers, setReceivers] = useState([{}])
  const [password, setPassword] = useState("");
  const updateReceivers = (index, address, value) => {
    let newReceivers = [...receivers];
    newReceivers[index] = {address: address, value: value}
    setReceivers(newReceivers);
  }

  const sendTx = () => {
    getWalletBox(props.wallet.id).then(boxes => {
      let totalErg = 0;
      let totalRequired = Math.floor(1e9 * receivers.map(item => item.value) + 1e6)
      let selectedBoxes = []
      for (let box of boxes) {
        const value = box.erg * 1e9 + box.nano_erg
        const ergo_box = wasm.ErgoBox.from_json(box.json);
        selectedBoxes.push(ergo_box)
        totalErg += value
        if (totalErg >= totalRequired) {
          break;
        }
      }
      const outputs = receivers.map(receiver => {
        const contract = wasm.Contract.pay_to_address(receiver.address)
        const boxBuilder = new wasm.ErgoBoxCandidateBuilder(
          wasm.BoxValue.from_i64(wasm.I64.from_str((receiver.value * 1e9).toString())),
          contract,
          0
        )
        return boxBuilder.build()
      });
    })
  }

  return (
    <Container style={{marginTop: 20}}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/*<AddressSelector/>*/}
          <Divider/>
          {receivers.map((receiver, index) => <ReceiverRow
            setValue={(address, value) => updateReceivers(index, address, value)} {...receiver}/>)}
          <Divider/>
        </Grid>
        <Grid item xs={12}>
          <PasswordInput
            label="Password"
            error={false}
            password={password}
            setPassword={setPassword}/>
        </Grid>
        <Grid item xs={12}>
          {/*<ReceiverRow/>*/}
          <Button variant="contained" fullWidth color="primary" onClick={sendTx}>
            Send
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default SendTab;
