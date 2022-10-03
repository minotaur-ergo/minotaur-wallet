// in ./build.js
const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/start.js');
const oldConfigFactory = defaults.__get__('configFactory');
const updateConfig = require('./update-config');

// required to update configs
const configFactory = (webpackEnv) => {
    let config = oldConfigFactory(webpackEnv);
    return updateConfig(config)
}

defaults.__set__('configFactory', configFactory)