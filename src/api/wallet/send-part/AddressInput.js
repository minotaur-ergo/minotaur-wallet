import React, { useState } from "react";
import { FormControl } from "@material-ui/core";
import TextInput from "../../../components/TextInput";

const AddressInput = props => {
  const [value, setValue] = useState("");
  const validateAddress = () => {

  }
  return (
    <FormControl fullWidth style={{marginTop: 20}}>
      {/*<InputLabel id="demo-simple-select-label">Receiver Address</InputLabel>*/}
      <TextInput
        label="Receiver Address"
        error={validateAddress()}
        value={value}
        setValue={value => setValue(value)}
      />
    </FormControl>
  )
}

export default AddressInput;
