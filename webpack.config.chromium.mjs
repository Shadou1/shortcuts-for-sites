import { dirname } from 'path'
import { fileURLToPath } from 'url'
import WebExtPlugin from 'web-ext-plugin'
import CopyPlugin from 'copy-webpack-plugin'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default {
  context: rootDir,

  entry: {
    'init': {
      import: './content-scripts/init.ts',
      filename: './content-scripts/init.js',
    },
    'background': {
      import: './background-scripts/background.ts',
      filename: './background-scripts/background.js'
    },
    'browser-action': {
      import: './pages/browser-action/default.ts',
      filename: './pages/browser-action/default.js',
    },
    'options': {
      import: './pages/options/options.ts',
      filename: './pages/options/options.js',
    },
  },

  output: {
    path: rootDir + '/dist-chromium',
    clean: true
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js', to: '.' },
        { from: './manifest-chromium.json', to: './manifest.json', },
        { from: './pages/*/*.(html|css)', to: '.' },
        { from: './icons/browser-action-*.png', to: '.' },
        { from: './LICENSE', to: '.' },
      ],
    }),
    new WebExtPlugin({
      sourceDir: rootDir + '/dist-chromium',
      artifactsDir: rootDir + '/web-ext-artifacts-chromium',
      buildPackage: true,
      overwriteDest: true,
      target: 'chromium',
    }),
  ],

  experiments: {
    topLevelAwait: true
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  mode: 'production'
}
