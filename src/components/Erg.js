import React from 'react'


const erg = props => {
  let nano_erg = isNaN(props.nano_erg)? 0 :  props.nano_erg;
  let erg = Math.floor(nano_erg / 1e9)
  nano_erg -= erg * 1e9;
  erg += isNaN(props.erg) ? 0 : props.erg;
  nano_erg = "" + nano_erg;
  while(nano_erg.length < 9) nano_erg = "0" + nano_erg
  while (nano_erg.length > 3 && nano_erg.substr(nano_erg.length - 1) === "0") nano_erg = nano_erg.substr(0, nano_erg.length - 1)
  let unit = '';
  if (props.showUnit) unit = ' erg'
  return (
    <span className={props.class}>{erg}.{nano_erg} {unit}</span>
  )
}

export default erg
