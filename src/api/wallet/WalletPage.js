import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import WithAppBar from "../../layout/WithAppBar";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { makeStyles } from "@material-ui/core";
import { FormatListBulleted } from "@material-ui/icons";
import TransactionTab from "./TransactionTab";
import WalletHeader from "../../hoc/WalletHeader";
import { RouteMap } from "../../router/WalletRouter";
import * as actionTypes from "../../store/actionType";
import { connect } from "react-redux";
import AddressTab from "./AddressTab";
import SendTab from "./SendTab";
import DAppsTab from "./DAppsTab";

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

const InWalletPage = (props) => {
  const [page, setPage] = useState("transaction")
  const wallets = props.wallets.filter(item => '' + item.id === '' + props.match.params.id);
  const [value, setValue] = React.useState(0);

  if (wallets.length === 0) {
    try {
      props.history.replace(RouteMap.Home)
    } catch (e) {
      props.history.push(RouteMap.Home);
    }
  }
  const wallet = wallets[0]
  const classes = useStyles()
  const gotoPage = page_name => () => {
    setPage(page_name)
  }
  return (
    <WithAppBar header={<WalletHeader walletName={wallet.name}/>}>
      <div className={classes.content}>
        {page === "transaction" ? <TransactionTab wallet={wallet}/> : null}
        {page === "send" ? <SendTab wallet={wallet}/> : null}
        {page === "receive" ? <AddressTab wallet={wallet}/> : null}
        {page === "dapps" ? <DAppsTab wallet={wallet}/> : null}
      </div>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={classes.stickToBottom}
      >
        <BottomNavigationAction onClick={gotoPage("transaction")} label="Transactions" icon={<FormatListBulleted/>}/>
        {wallet.type === "readonly" ? null : (
          <BottomNavigationAction onClick={gotoPage("send")} label="Send" icon={<FavoriteIcon/>}/>
        )}
        {wallet.type === "readonly" ? (
          <BottomNavigationAction onClick={gotoPage("addresses")} label="Addresses" icon={<LocationOnIcon/>}/>
        ) : (
          <BottomNavigationAction onClick={gotoPage("receive")} label="Receive" icon={<LocationOnIcon/>}/>
        )}
        {wallet.type === "readonly" ? null : (
          <BottomNavigationAction onClick={gotoPage("dapps")} label="dApps" icon={<LocationOnIcon/>}/>
        )}
      </BottomNavigation>
    </WithAppBar>
  )
}


const mapStateToProps = state => ({
  wallets: state.wallets,
});

const mapDispatchToProps = dispatch => ({
  setWallets: wallets => dispatch({type: actionTypes.SET_WALLETS, payload: wallets})
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InWalletPage));
