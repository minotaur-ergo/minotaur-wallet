import React from "react";
import AddressInput from "./AddressInput";
import ErgoAmount from "./ErgoAmount";

const ReceiverRow = props => {
  return (
    <React.Fragment>
      <AddressInput/>
      <ErgoAmount/>
    </React.Fragment>
  )
}

export default ReceiverRow;
