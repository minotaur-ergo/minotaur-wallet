import React, { useEffect, useState } from "react";
import { Divider, List } from "@material-ui/core";
import TransactionElement from "./TransactionElement";
import { getAddress } from "../../db/web/address";

const AddressTab = props => {
  const [addresses, setAddresses] = useState([])
  useEffect(() => {
    if(!addresses) {
      getAddress(props.wallet).then(addresses => {
        setAddresses(addresses)
      })
    }
  }, [])
  return (
    <List>
      <div>here are addresses</div>
      {addresses.map(transaction => (
        <React.Fragment key={transaction.id}>
          <TransactionElement {...transaction}/>
          <Divider/>
        </React.Fragment>
      ))}
    </List>
  )
}

export default AddressTab;
