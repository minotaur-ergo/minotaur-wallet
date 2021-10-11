import React, { useEffect, useState } from "react";
import { Divider, List } from "@material-ui/core";
import AddressElement from "./AddressElement";
import { getWalletAddresses } from "../../../db/commands/address";
import DriveAddress from './DriveAddress';

const AddressTab = props => {
  const [addresses, setAddresses] = useState([])
  useEffect(() => {
    if (addresses.length === 0) {
      getWalletAddresses(props.wallet).then(addresses => {
        setAddresses(addresses)
      })
    }
  }, [])
  return (
    <React.Fragment>
      <DriveAddress/>
      <List>
        {addresses.map(transaction => (
          <React.Fragment key={transaction.id}>
            <Divider/>
            <AddressElement {...transaction}/>
          </React.Fragment>
        ))}
      </List>
    </React.Fragment>
  )
}

export default AddressTab;
