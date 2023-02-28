/** @type {import('typedoc').TypeDocOptions} */

module.exports = {
  entryPoints: ["src"],
  out: "docs",
  theme: "default",
  excludePrivate: true,
  excludeExternals: true,
  readme: "none",
  excludeInternal: true,
  exclude: [
    "src/utils/emmiter.ts",
    "src/utils/constants.ts",
    "src/primitives/**",
    "src/utils/helper.ts"
  ]
};
