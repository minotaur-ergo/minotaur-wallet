import React from "react";
import WalletInsertOption from "./WalletInsertOption";
import InsertWallet from "./insert/InsertWallet";

class WalletAddBody extends React.Component {
    state = {
        walletType: null,
    }
    selectType = (walletType) => {
        this.setState({walletType: walletType})
    }

    render = () => {
        return (
            <React.Fragment>
                {this.state.walletType === null ? <WalletInsertOption setWalletType={this.selectType}/> : null}
                {this.state.walletType === "new" ? <InsertWallet back={() => this.setState({walletType: null})}/>: null}
            </React.Fragment>
        )
    }
}

export default WalletAddBody;
