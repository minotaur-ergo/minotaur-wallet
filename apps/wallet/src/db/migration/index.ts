import { Server1730363833234 } from '@/db/migration/1730363833234-server';
import { SpendBoxInfo1719388610915 } from './1719388610915-spend-box-info';
import { initialize1687534587363 } from './1687534587363-initialize';

const Migrations = [
  initialize1687534587363,
  SpendBoxInfo1719388610915,
  Server1730363833234,
];

export default Migrations;
