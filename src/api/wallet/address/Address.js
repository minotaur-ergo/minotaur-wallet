import React, { useEffect } from "react";
import { Divider, List } from "@material-ui/core";
import AddressElement from "./AddressElement";
import DriveAddress from './DriveAddress';
import InWalletPage from "../../../layout/InWalletPage";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { loadAddresses } from "../../../store/action";

const Address = props => {
    useEffect(() => loadAddresses(props.wallet))
    return (
        <React.Fragment>
            <DriveAddress/>
            <List>
                {props.address.map(address => (
                    <React.Fragment key={address.id}>
                        <Divider/>
                        <AddressElement {...address}/>
                    </React.Fragment>
                ))}
            </List>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    address: state.address,
});
export default connect(mapStateToProps)(InWalletPage("address")(withRouter(Address)))


