import { tokenWithAddress1645511306482 } from './1645511306482-token_with_address';
import { walletTx1645511299711 } from './1645511299711-wallet_tx';
import { walletWithErg1645511292840 } from './1645511292840-wallet_with_erg';
import { addressTokenId1645511287133 } from './1645511287133-address_token_id';
import { addressWithErg1645511276955 } from './1645511276955-address_with_erg';
import { boxContent1645511268668 } from './1645511268668-box_content';
import { box1645511260273 } from './1645511260273-box';
import { address1645511254267 } from './1645511254267-address';
import { wallet1645511249599 } from './1645511249599-wallet';
import { block1645511116354 } from './1645511116354-block';
import { tx1645511237301 } from './1645511237301-tx';
import { asset1645511244626 } from './1645511244626-asset';
import { config1650404055667 } from './1650404055667-config';
import { deleteViews1655183401851 } from './1655183401851-delete-views';
import { refreshAllEntities1655185294135 } from './1655185294135-refresh-all-entities';
import { deleteBoxAndBoxContent1656038579911 } from './1656038579911-delete-box-and-box-content';
import { refactorAddress1656038696301 } from './1656038696301-refactor-address';
import { refactorTx1656038756722 } from './1656038756722-refactor-tx';
import { recreateBoxAndBoxContent1656038840212 } from './1656038840212-recreate-box-and-box-content';
import { recreateViews1656038900762 } from './1656038900762-recreate-views';
import { createAssetsCount1656865711897 } from './1656865711897-create-assets-count';
import { createAssetsCountBoxes1656865730031 } from './1656865730031-create-assets-boxes-count';
import { txBoxCount1667225460029 } from './1667225460029-tx-box-count';
import { multiSigKeys1668085091261 } from './1668085091261-multi-sig-keys';
import { blockUpdate1676080469354 } from './1676080469354-block-update';
import { MultiSig1676570528123 } from './1676570528123-multi-sig';
import { MultiSigFix1694934009126 } from './1694934009126-multi-sig-fix';
import { cleanupMultiSigData1697532775886 } from './1697532775886-cleanup-multi-sig-data';
import { MultiSigFix1694934009126 } from './1694934009126-multi-sig-fix';

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
  deleteViews1655183401851,
  refreshAllEntities1655185294135,
  deleteBoxAndBoxContent1656038579911,
  refactorAddress1656038696301,
  refactorTx1656038756722,
  recreateBoxAndBoxContent1656038840212,
  recreateViews1656038900762,
  createAssetsCount1656865711897,
  createAssetsCountBoxes1656865730031,
  txBoxCount1667225460029,
  multiSigKeys1668085091261,
  blockUpdate1676080469354,
  MultiSig1676570528123,
  MultiSigFix1694934009126,
  cleanupMultiSigData1697532775886,
  MultiSigFix1694934009126,
];

export default Migrations;
