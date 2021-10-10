import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { getAddress } from "../../../db/web/address";
import WithWallet from "../../../hoc/WithWallet";


const AddressSelector = props => {
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(-1)
  useEffect(() => {
    getAddress(props.wallet).then(addresses => {
      setAddresses(addresses)
    })
  }, [])
  let erg = 0, nano_erg = 0
  if (selectedAddress === -1) {
    addresses.forEach(item => {
      erg += isNaN(item.erg) ? 0 : item.erg
      nano_erg += isNaN(item.nano_erg) ? 0 : item.nano_erg
    })
  } else {
    const addrObject = addresses[selectedAddress]
    erg = isNaN(addrObject.erg) ? 0 : addrObject.erg
    nano_erg = isNaN(addrObject.nano_erg) ? 0 : addrObject.nano_erg
  }
  return (
    <React.Fragment>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedAddress}
          label="From Address"
          onChange={event => setSelectedAddress(event.target.value)}
        >
          <MenuItem value={-1}>All {addresses.length} Addresses</MenuItem>
          {addresses.map((address, index) => <MenuItem key={index} value={index}>{address.name}</MenuItem>)}
        </Select>
      </FormControl>
      <div style={{marginTop: 20, marginBottom: 20}}>
        Balance: {erg}.{nano_erg} Ergs
      </div>
    </React.Fragment>
  )
}

export default WithWallet(AddressSelector);
