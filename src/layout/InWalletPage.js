import React, { useEffect, useState } from "react";
import WithAppBar from "./WithAppBar";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { FormatListBulleted } from "@material-ui/icons";
import WalletHeader from "./WalletHeader";
import { makeStyles } from "@material-ui/core/styles";
import { RouteMap } from "../router/RouterSwitch";
import { loadWallet } from "../db/action/Wallet";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getRoute } from "../router/WalletRouter";

const useStyles = makeStyles(theme => ({
    stickToBottom: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
    },
    content: {
        paddingBottom: '80px'
    }
}));

const TABS = [
    "transaction",
    "send",
    "address",
    "dapps"
]

const InWalletPage = tab => {
    return WrappedComponent => {
        const NewComponent = props => {
            const tabIndex = TABS.indexOf(tab);
            const [walletLoading, setWalletLoading] = useState(false);
            const [wallet, setWallet] = useState({})
            const gotoPage = page_url => () => {
                try {
                    props.history.replace(page_url)
                } catch (e) {
                    props.history.push(page_url);
                }
            }
            useEffect(() => {
                if (!props.walletsValid && !walletLoading) {
                    setWalletLoading(true);
                    loadWallet().then(() => {
                        setWalletLoading(false)
                    })
                } else if (props.walletsValid) {
                    const wallets = props.wallets.filter(item => '' + item.id === '' + props.match.params.id);
                    if (wallets.length === 0) {
                        gotoPage(RouteMap.Home)
                    }
                    setWallet(wallets[0]);
                }
            }, [walletLoading]);
            console.log(wallet);
            const classes = useStyles()
            return (
                <WithAppBar header={<WalletHeader walletName={wallet.name}/>}>
                    <div className={classes.content}>
                        <WrappedComponent {...props} wallet={wallet}/>
                    </div>
                    <BottomNavigation
                        value={tabIndex}
                        showLabels
                        className={classes.stickToBottom}
                    >
                        {wallet.type === 'cold' ? null : (
                            <BottomNavigationAction
                                onClick={gotoPage(RouteMap.WalletTransaction)}
                                label="Transactions"
                                icon={<FormatListBulleted/>}/>
                        )}
                        <BottomNavigationAction
                            onClick={gotoPage("send")}
                            label="Send"
                            icon={<FavoriteIcon/>}/>
                        <BottomNavigationAction
                            onClick={gotoPage(getRoute(RouteMap.WalletAddress, {id: props.match.params.id}))}
                            label="Addresses"
                            icon={<LocationOnIcon/>}/>
                        <BottomNavigationAction
                            onClick={gotoPage(getRoute(RouteMap.WalletDApps, {id: props.match.params.id}))}
                            label="dApps" icon={<LocationOnIcon/>}/>
                    </BottomNavigation>
                </WithAppBar>
            )
        }
        const mapStateToProps = state => ({
            wallets: state.wallets,
            walletsValid: state.valid.wallet,
        });
        return withRouter(connect(mapStateToProps)(NewComponent))
    }
}

export default InWalletPage;
