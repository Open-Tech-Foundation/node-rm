import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: './lib/index.cjs.js',
      format: 'cjs',
    },
    {
      file: './lib/index.esm.js',
      format: 'esm',
    },
  ],
  plugins: [typescript({ tsconfig: './tsconfig.json' })],
  external: [
    '@open-tech-world/es-cli-styles',
    '@open-tech-world/node-glob',
    'fs',
    'path',
  ],
};
