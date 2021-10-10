import React, { useState } from "react";
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";

const AddressInput = props => {
  const [value, setValue] = useState("");
  const validateAddress = () => {

  }
  const displayQrCodeScanner = () => {}
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel>Receiver Address</InputLabel>
      <OutlinedInput
        label="Receiver Address"
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoComplete="off"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={displayQrCodeScanner}
              onMouseDown={(event) => event.preventDefault()}
              edge="end"
            >
              <FontAwesomeIcon icon={faQrcode} />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  )
}

export default AddressInput;
