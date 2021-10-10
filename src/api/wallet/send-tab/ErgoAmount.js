import React, { useState } from "react";
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

const ErgoAmount = props => {
  const [value, setValue] = useState("");
  const validateAddress = () => {

  }
  const displayQrCodeScanner = () => {}
  return (
    <FormControl fullWidth style={{marginTop: 20}} variant="outlined">
      <InputLabel id="demo-simple-select-label">Amount</InputLabel>
      <OutlinedInput
        label="Amount"
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
              <FontAwesomeIcon icon={faArrowDown} />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  )
}

export default ErgoAmount;
