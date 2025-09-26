import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { builtinModules, createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const builtinSet = new Set([...builtinModules, ...builtinModules.map((m) => `node:${m}`)]);
const peerNames = Object.keys(pkg.peerDependencies || {});

export default [
  {
    input: 'src/index.ts',
    output: {
      exports: 'named',
      dir: 'dist',
      format: 'esm',
      sourcemap: false,
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true,
        preferBuiltins: false,
        exportConditions: ['browser', 'mui-modern', '...'],
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['node_modules/**', '**/*.stories.tsx', '**/*.test.tsx'],
      }),
      postcss({
        extract: true,
        modules: false,
        minimize: true,
        sourceMap: false,
      }),
      babel({
        exclude: ['node_modules/**', '**/*.stories.tsx', '**/*.test.tsx'],
        presets: ['@babel/preset-react'],
        babelHelpers: 'bundled',
      }),
      terser(),
    ],
    onwarn(warning, warn) {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes(`"use client"`))
        return;
      warn(warning);
    },
    external: (id) => {
      if (builtinSet.has(id)) return true;
      if (id === 'tslib' || id.startsWith('tslib/')) return true;
      return peerNames.some((name) => id === name || id.startsWith(`${name}/`));
    },
  },
];
