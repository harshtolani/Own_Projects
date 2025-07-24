import base from './rollup.config.base';

export default Object.assign(base, {
  format: 'umd',
  moduleName: 'harsh',
  dest: 'dist/harsh.umd.js'
});
