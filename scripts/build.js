// in ./build.js
import rewire from 'rewire';
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');
import updateConfig from './update-config';

defaults.__set__('config', updateConfig(config))