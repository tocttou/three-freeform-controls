module.exports = {
  mode: 'file',
  out: 'docs',
  theme: 'default',
  ignoreCompilerErrors: true,
  excludePrivate: true,
  excludeNotExported: true,
  excludeExternals: true,
  target: 'ES6',
  moduleResolution: 'node',
  preserveConstEnums: true,
  stripInternal: true,
  suppressExcessPropertyErrors: true,
  suppressImplicitAnyIndexErrors: true,
  module: 'es2015',
  readme: 'none',
  exclude: [
    'src/utils/**',
    'src/primitives/**'
  ],
};
