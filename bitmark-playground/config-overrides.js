// config-overrides.js
const { override, addWebpackResolve, addWebpackPlugin } = require('customize-cra');

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = override(
  addWebpackResolve({
    fallback: {
      module: false,
      fs: false,
      path: false,
      crypto: false,
    },
  }),
  addWebpackPlugin(
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/microsoft/monaco-editor/blob/main/webpack-plugin/README.md#options
      // languages: ['json', 'ini'],
      languages: ['json'],
      // features: ['!gotoSymbol'],
    }),
  ),
  // Allow .mjs files in src/lib/ to import packages without file extensions.
  // Webpack 5 treats .mjs as strict ESM which requires fully-specified imports,
  // but the vendored bundles use bare specifiers like '@mui/material/styles'.
  (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /src\/lib\//,
      resolve: { fullySpecified: false },
    });
    return config;
  },
);

// For information on customizing Monaco:
// const metadata = require('monaco-editor/esm/metadata');

// console.log(metadata.features);
// console.log(metadata.languages);
