import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
// import typescript from "@rollup/plugin-typescript";

const typescript = require('rollup-plugin-typescript2');
const postcss = require('rollup-plugin-postcss'); 
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
const rdel = require('rollup-plugin-delete');

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
                dir: 'dist',
                format: "esm",
                sourcemap: true,
                preserveModules: true,
                preserveModulesRoot: 'src',
            },
        ],
        plugins: [
            rdel({ targets:  'dist/*', runOnce: true }),
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
            terser(),
            postcss(),
        ],
        external: ["react", "react-dom"]
    },
    /*{
        input: "src/types/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "esm" }],
        plugins: [dts()],
    },*/
];