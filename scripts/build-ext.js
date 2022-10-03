// in ./build.js
const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');
const updateConfig = require('./update-connector-config');

defaults.__set__('config', updateConfig(config))