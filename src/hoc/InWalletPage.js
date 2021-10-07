import React from "react";
import { withRouter } from "react-router-dom";
import WithAppBar from "../layout/WithAppBar";
import WalletHeader from "./WalletHeader";
import { Wallets } from "../const";
import { RouteMap } from "../router/WalletRouter";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { makeStyles } from "@material-ui/core";
import { FormatListBulleted } from "@material-ui/icons";

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
const InWalletPage = (Component) => {
    const WithWalletComponent = props => {
        const wallets = Wallets.filter(item => '' + item.id === '' + props.match.params.id);
        const [value, setValue] = React.useState(0);

        if (wallets.length === 0) {
            this.props.history.replace(RouteMap.Home)
        }
        const wallet = wallets[0]
        const classes = useStyles()
        return (
            <WithAppBar header={<WalletHeader walletName={wallet.name}/>}>
                <div className={classes.content}>
                    <Component {...props} wallet={wallet}/>
                </div>
                <BottomNavigation
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    showLabels
                    className={classes.stickToBottom}
                >
                    <BottomNavigationAction label="Transactions" icon={<FormatListBulleted/>}/>
                    <BottomNavigationAction label="Send" icon={<FavoriteIcon/>}/>
                    <BottomNavigationAction label="Receive" icon={<LocationOnIcon/>}/>
                    <BottomNavigationAction label="dApps" icon={<LocationOnIcon/>}/>
                </BottomNavigation>
            </WithAppBar>
        )
    }
    return withRouter(WithWalletComponent)
}

export default InWalletPage
