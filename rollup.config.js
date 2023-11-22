  

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";

// To handle css files
import postcss from "rollup-plugin-postcss";

import peerDepsExternal from 'rollup-plugin-peer-deps-external';


const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      /*{
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },*/
      {
            exports: 'named',
            dir: 'dist',
            format: 'esm',
            sourcemap: true,
            preserveModules: true,
            preserveModulesRoot: 'src'
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs({requireReturnsDefault: 'esmExternals', defaultIsModuleExports: 'auto', esmExternals: true}), // option avoid 'default' export error
      typescript({ tsconfig: "./tsconfig.json"}), // get declarations options from tsconfig
      postcss(), 
      terser(),
    ],
    onwarn(warning, warn) { // avoid mui warning
      if (
        warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
        warning.message.includes(`'use client'`)
      ) {
        return;
      }
      warn(warning);
    }
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],

    external: [/\.css$/], // telling rollup anything that is .css aren't part of type exports 
  },
]