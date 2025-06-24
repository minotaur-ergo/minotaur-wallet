import { Pin1740834014451 } from '@/db/migration/1740834014451-pin';
import { NewMultiSig1746719636595 } from '@/db/migration/1746719636595-new-multi-sig';

import { initialize1687534587363 } from './1687534587363-initialize';
import { SpendBoxInfo1719388610915 } from './1719388610915-spend-box-info';

const Migrations = [
  initialize1687534587363,
  SpendBoxInfo1719388610915,
  Pin1740834014451,
  NewMultiSig1746719636595,
];

export default Migrations;
