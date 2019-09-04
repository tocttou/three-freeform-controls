import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import camelCase from "lodash.camelcase";
import typescript from "rollup-plugin-typescript2";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import json from "rollup-plugin-json";

const pkg = require("./package.json");

const libraryName = "three-freeform-controls";

export default {
  input: `src/index.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: "umd",
      sourcemap: true,
      globals: { three: "THREE" },
      exports: "named"
    },
    { file: pkg.module, format: "es", sourcemap: true, exports: "named" }
  ],
  external: [],
  watch: {
    include: "src/**"
  },
  plugins: [
    json(),
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs(),
    resolve(),
    sourceMaps(),
    peerDepsExternal()
  ]
};
