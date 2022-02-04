import React from "react";
import WalletList from "./WalletList";
import WithAppBar from "../../layout/WithAppBar";
import HomeHeader from "./HomeHeader";

const Home = () => (
    <WithAppBar header={<HomeHeader />}>
        <WalletList />
    </WithAppBar>
);

export default Home;
