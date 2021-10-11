import React, { useState } from "react";
import AddressInput from "./AddressInput";
import ErgoAmount from "./ErgoAmount";

const ReceiverRow = props => {
  const [address, setAddress] = useState(props.address)
  const [value, setValue] = useState(props.value)
  const setParam = (param, paramValue) => {
    if(param === "address"){
      setAddress(paramValue)
    }else{
      setValue(paramValue)
    }
    props.setValue({address: address, value: value})
  }
  return (
    <React.Fragment>
      <AddressInput value={address} setValue={val => setParam("address", val)}/>
      <ErgoAmount value={value} setValue={val => setParam("value", val)}/>
    </React.Fragment>
  )
}

export default ReceiverRow;
