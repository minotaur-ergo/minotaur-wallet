import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import Wallet, { WalletType } from "../../db/entities/Wallet";
import { GlobalStateType } from "../../store/reducer";
import { connect } from "react-redux";
import WithAppBar from "../../layout/WithAppBar";
import AppHeader from "../../header/AppHeader";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { getRoute, RouteMap } from "../../router/WalletRouter";
import {
    AssistantOutlined,
    ContactMailOutlined,
    FormatListBulletedOutlined,
    ReceiptOutlined
} from "@material-ui/icons";
import SendTransaction from "./send/SendTransaction";
import AddressList from "./address/AddressList";
import DAppList from "./dapps/DAppList";
import Transaction from "./transaction/Transaction";
import { loadWallets } from "../../action/wallet";
import AssetList from "./asset/AssetList";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";

const useStyles = makeStyles(theme => ({
    stickToBottom: {
        width: "100%",
        position: "fixed",
        bottom: 0
    },
    content: {
        paddingBottom: "80px"
    }
}));

const TABS = [
    "transaction",
    "send",
    "address",
    "assets",
    "dApps"
];

interface PropsType extends RouteComponentProps<{ id: string }> {
    walletsValid: boolean;
    wallets: Array<Wallet>;
}

export interface WalletPagePropsType {
    wallet: Wallet;
    setTab: (name: string) => any;
}

const gotoPage = (props: PropsType, page_url: string) => () => {
    try {
        props.history.replace(page_url);
    } catch (e) {
        props.history.push(page_url);
    }
};

const WalletPage = (props: PropsType) => {
    const [wallet, setWallet] = useState<Wallet>();
    const [tabs, setTabs] = useState({ show: true, active: "" });
    const tabIndex = TABS.indexOf(tabs.active);
    const [walletLoading, setWalletLoading] = useState(false);
    const classes = useStyles();
    useEffect(() => {
        if (!props.walletsValid && !walletLoading) {
            setWalletLoading(true);
            loadWallets().then(() => {
                setWalletLoading(false);
            });
        } else if (props.walletsValid) {
            if (!wallet || wallet.id + "" !== props.match.params.id) {
                const wallets = props.wallets.filter(item => "" + item.id === "" + props.match.params.id);
                if (wallets.length === 0) {
                    gotoPage(props, RouteMap.Home);
                }
                setWallet(wallets[0]);
            }
        }
    }, [props, walletLoading, wallet]);
    const setCurrentTab = (name: string) => {
        if (!tabs.show || name !== tabs.active) {
            setTabs({ show: true, active: name });
        }
    };
    return (
        <WithAppBar header={<AppHeader title={wallet ? wallet.name : ""} />}>
            <div className={classes.content}>
                {wallet ? (
                    <React.Fragment>
                        <Route path={RouteMap.WalletTransaction} exact>
                            <Transaction setTab={setCurrentTab} wallet={wallet} />
                        </Route>
                        <Route path={RouteMap.WalletSend} exact>
                            <SendTransaction setTab={setCurrentTab} wallet={wallet} />
                        </Route>
                        <Route path={RouteMap.WalletAddress} exact>
                            <AddressList setTab={setCurrentTab} wallet={wallet} />
                        </Route>
                        <Route path={RouteMap.WalletAssets} exact>
                            <AssetList setTab={setCurrentTab} wallet={wallet} />
                        </Route>
                        <Route path={RouteMap.WalletDApps} exact>
                            <DAppList setTab={setCurrentTab} wallet={wallet} />
                        </Route>
                    </React.Fragment>
                ) : null}
            </div>
            {tabs.show && wallet ? (
                <BottomNavigation
                    value={tabIndex}
                    showLabels
                    className={classes.stickToBottom}
                >
                    {wallet.type === WalletType.Cold ? null : (
                        <BottomNavigationAction
                            onClick={gotoPage(props, getRoute(RouteMap.WalletTransaction, { id: props.match.params.id }))}
                            label="Transactions"
                            icon={<FormatListBulletedOutlined />} />
                    )}
                    <BottomNavigationAction
                        onClick={gotoPage(props, getRoute(RouteMap.WalletSend, { id: props.match.params.id }))}
                        label="Send"
                        icon={<ReceiptOutlined />} />
                    <BottomNavigationAction
                        onClick={gotoPage(props, getRoute(RouteMap.WalletAddress, { id: props.match.params.id }))}
                        label="Addresses"
                        icon={<ContactMailOutlined />} />
                    <BottomNavigationAction
                        onClick={gotoPage(props, getRoute(RouteMap.WalletAssets, { id: props.match.params.id }))}
                        label="Assets"
                        icon={<AccountBalanceWalletIcon />} />
                    <BottomNavigationAction
                        onClick={gotoPage(props, getRoute(RouteMap.WalletDApps, { id: props.match.params.id }))}
                        label="dApps" icon={<AssistantOutlined />} />
                </BottomNavigation>
            ) : null}
        </WithAppBar>
    );
};

const mapsPropsToDispatch = (state: GlobalStateType) => ({
    wallets: state.wallet.wallets,
    walletsValid: state.wallet.walletValid
});

export default connect(mapsPropsToDispatch)(withRouter(WalletPage));
