import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import replace from "@rollup/plugin-replace";
import typescript from "rollup-plugin-typescript2";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import multiInput from "rollup-plugin-multi-input";

export default {
  input: ["examples/*.js", "examples/*.ts"],
  output: {
    dir: "dist",
    format: "esm",
  },
  watch: {
    include: "*/**",
  },
  plugins: [
    multiInput(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          target: "ES6",
        },
      },
    }),
    commonjs(),
    resolve(),
    sourceMaps(),
    // peerDepsExternal(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
    serve({
      open: true,
      contentBase: ["dist"],
      openPage: "/",
      historyApiFallback: true,
    }),
    livereload(),
  ],
};
