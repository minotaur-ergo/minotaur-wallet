import { tokenWithAddress1645511306482 } from "./1645511306482-token_with_address";
import {walletTx1645511299711} from "./1645511299711-wallet_tx";
import { walletWithErg1645511292840 } from "./1645511292840-wallet_with_erg";
import { addressTokenId1645511287133 } from "./1645511287133-address_token_id";
import { addressWithErg1645511276955 } from "./1645511276955-address_with_erg";
import { boxContent1645511268668 } from "./1645511268668-box_content";
import { box1645511260273 } from "./1645511260273-box";
import { address1645511254267 } from "./1645511254267-address";
import { wallet1645511249599 } from "./1645511249599-wallet";
import { block1645511116354 } from "./1645511116354-block";
import { tx1645511237301 } from "./1645511237301-tx";
import { asset1645511244626 } from "./1645511244626-asset";
import { config1650404055667 } from "./1650404055667-config";
import { deleteViews1655183401850 } from "./1655183401850-delete-views";
import { refactorAddress1655184495240 } from "./1655184495240-refactor-address";
import { refactorTx1655185030188 } from "./1655185030188-refactor-tx";
import { refreshAllEntities1655185294134 } from "./1655185294134-refresh-all-entities";
import { recreateViews1655185359369 } from "./1655185359369-recreate-views";

const Migrations = [
    block1645511116354,
    tx1645511237301,
    asset1645511244626,
    wallet1645511249599,
    address1645511254267,
    box1645511260273,
    boxContent1645511268668,
    addressWithErg1645511276955,
    addressTokenId1645511287133,
    walletWithErg1645511292840,
    walletTx1645511299711,
    tokenWithAddress1645511306482,
    config1650404055667,
    deleteViews1655183401850,
    refactorAddress1655184495240,
    refactorTx1655185030188,
    refreshAllEntities1655185294134,
    recreateViews1655185359369
];

export default Migrations;
