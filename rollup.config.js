import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import replace from "@rollup/plugin-replace";
import typescript from "rollup-plugin-typescript2";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import json from "@rollup/plugin-json";

const pkg = require("./package.json");

export default {
  input: `src/index.ts`,
  output: [
    { file: pkg.module, format: "es", sourcemap: true, exports: "named" }
  ],
  external: [],
  watch: {
    include: "src/**"
  },
  plugins: [
    json(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          target: "ES6"
        },
      },
    }),
    commonjs(),
    resolve(),
    sourceMaps(),
    peerDepsExternal(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ]
};
