/* eslint-disable @typescript-eslint/no-var-requires */
const CapacitorCommunitySqlite = require('@capacitor-community/sqlite/electron/dist/plugin.js');
const MinotaurErgoHttp = require('@minotaur-ergo/http/electron/dist/plugin.js');

module.exports = {
  CapacitorCommunitySqlite:
    CapacitorCommunitySqlite.default || CapacitorCommunitySqlite,
  MinotaurErgoHttp: MinotaurErgoHttp.default || MinotaurErgoHttp,
};
