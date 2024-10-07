import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import terser  from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const isProduction = process.env.NODE_ENV === 'production';

export default [
  {
    input: 'src/index.ts',
    output: {
      exports: 'named',
      dir: 'dist',
      format: 'esm',
      sourcemap: !isProduction,
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['node_modules/**', '**/*.stories.tsx', '**/*.test.tsx'],
      }),
      babel({
        exclude: ['node_modules/**', '**/*.stories.tsx', '**/*.test.tsx'],
        presets: ['@babel/preset-react'],
        babelHelpers: 'bundled',
      }),
      terser(),
    ],
    onwarn(warning, warn) {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes(`"use client"`)) {
        return;
      }
      warn(warning);
    },
    external: [
      'react',
      'react-dom',
      'prop-types',
      '@testing-library/react',
      '@testing-library/jest-dom',
    ],
  },
];