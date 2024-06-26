import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'server.js',
  output: {
    file: 'dist/worker.js',
    format: 'iife',
    name: 'worker'
  },
  plugins: [
    resolve(),
    terser()
  ]
};
