// in ./build.js
import rewire from 'rewire';
const defaults = rewire('react-scripts/scripts/start.js');
const oldConfigFactory = defaults.__get__('configFactory');
import updateConfig from './update-config';

// required to update configs
const configFactory = (webpackEnv) => {
  let config = oldConfigFactory(webpackEnv);
  return updateConfig(config);
};

defaults.__set__('configFactory', configFactory);
