import React from "react";
import WalletInsertOption from "./WalletInsertOption";
import WalletNormalNew from "./wallet-normal-new/WalletNormalNew";

class AddWalletBody extends React.Component {
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
                {this.state.walletType === "new_normal" ? <WalletNormalNew back={() => this.setState({walletType: null})}/>: null}
            </React.Fragment>
        )
    }
}

export default AddWalletBody;
