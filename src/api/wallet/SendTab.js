import React, { useState } from "react";
import { Container, Divider, Grid } from "@material-ui/core";
import AddressSelector from "./send-part/AddressSelector";
import ReceiverRow from "./send-part/ReceiverRow";

const SendTab = props => {
  const [receivers, setReceivers] = useState([{}])
  return (
    <Container style={{marginTop: 20}}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AddressSelector/>
          <Divider/>
          {receivers.map(receiver => <ReceiverRow {...receiver}/>)}
          <Divider/>
          {/*<ReceiverRow/>*/}
        </Grid>
      </Grid>
    </Container>
  )
}

export default SendTab;
