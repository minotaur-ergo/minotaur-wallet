import React, { useState } from "react";
import { Checkbox, IconButton, ListItem, ListItemText, ListItemAvatar, Avatar } from "@material-ui/core";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QrCodeDialog from '../../../components/QrCodeDialog';
import { getRoute, RouteMap } from "../../../router/WalletRouter";
import { withRouter } from "react-router-dom";
import WithWallet from "../../../hoc/WithWallet";

const AddressElement = props => {
  const gotoWallet = () => {
    props.history.push(getRoute(RouteMap.WalletAddressRoute, {"id": props.wallet.id, address_id: props.id}))
  }
  const [showAddress, setShowAddress] = useState(false)
  const address = props.address.length > 30 ? props.address.substr(0, 15) + "..." + props.address.substr(props.address.length - 15) : props.address
  return (
    <ListItem onClick={gotoWallet}>
      <ListItemText primary={props.name} secondary={address}/>

      {/*<ListItemAvatar>*/}
      {/*  /!*<Avatar>*!/*/}
      {/*  <FontAwesomeIcon icon={faQrcode} onClick={() => setShowAddress(true)}/>*/}
      {/*  /!*</Avatar>*!/*/}
      {/*</ListItemAvatar>*/}
    </ListItem>
  )
}

export default withRouter(WithWallet(AddressElement));
