import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

// const typescript = require('rollup-plugin-typescript2');
const postcss = require('rollup-plugin-postcss'); 
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
const rdel = require('rollup-plugin-delete'); // delete dist every time

const packageJson = require("./package.json");


export default [
    {
      input: "src/index.ts",
      output: [
        /*{
          file: packageJson.main,
          format: 'cjs',
          sourcemap: true,
          name: '@famalabs/map-ui'
      },*/
      {
          //file: packageJson.module,
          dir: 'dist',
          format: 'esm',
          sourcemap: true,
          preserveModules: true,
          preserveModulesRoot: 'src'
      }
      ],
      plugins: [
        resolve(),
        commonjs(),
        peerDepsExternal(),
        typescript({ tsconfig: "./tsconfig.json" }),
        postcss(), 
        terser()
      ],
    },
    /*{
      input: "dist/types/index.d.ts",
      output: [{ file: "dist/index.d.ts", format: "esm" }],
      plugins: [dts()],
      // external: [/\.css$/],
    },*/
  ];