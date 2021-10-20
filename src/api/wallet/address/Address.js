import React, { useEffect, useState } from "react";
import { Divider, List } from "@material-ui/core";
import AddressElement from "./AddressElement";
import DriveAddress from './DriveAddress';
import InWalletPage from "../../../layout/InWalletPage";
import { loadWalletAddress } from "../../../db/action/Address";
import { withRouter } from "react-router-dom";

const Address = props => {
    const [addresses, setAddresses] = useState([])
    useEffect(() => {
        if (addresses.length === 0) {
            loadWalletAddress(props.match.params.id).then(dbAddresses => {
                console.log(dbAddresses)
                setAddresses(dbAddresses)
            })
            // getWalletAddresses(props.wallet).then(addresses => {
            //   setAddresses(addresses)
            // })
        }
    }, [])
    addresses.map(item => console.log(item));
    return (
        <React.Fragment>
            <DriveAddress/>
            <List>
                {addresses.map(address => (
                    <React.Fragment key={address.id}>
                        <Divider/>
                        <AddressElement {...address}/>
                    </React.Fragment>
                ))}
            </List>
        </React.Fragment>
    )
}

export default InWalletPage("address")(withRouter(Address));
