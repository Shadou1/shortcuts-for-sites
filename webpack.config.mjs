import { dirname } from 'path'
import { fileURLToPath } from 'url'
import WebExtPlugin from 'web-ext-plugin'
import CopyPlugin from 'copy-webpack-plugin'

export default {
  context: dirname(fileURLToPath(import.meta.url)),

  entry: {
    'init': {
      import: './content-scripts/init.js',
      filename: './content-scripts/init.js',
    },
    'background': {
      import: './background-scripts/background.js',
      filename: './background-scripts/background.js'
    },
    'browser-action': {
      import: './pages/browser-action/default.js',
      filename: './pages/browser-action/default.js',
    },
    'options': {
      import: './pages/options/options.js',
      filename: './pages/options/options.js',
    },
  },

  output: {
    path: dirname(fileURLToPath(import.meta.url)) + '/dist',
    clean: true
  },

  module: {
    rules: [
      // {
      //   test: /\.tsx?$/,
      //   use: 'ts-loader',
      //   exclude: /node_modules/,
      // },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './manifest.json', to: '.' },
        { from: './pages/*/*.(html|css)', to: '.' },
        { from: './icons/*', to: '.' },
      ],
    }),
    new WebExtPlugin({
      sourceDir: dirname(fileURLToPath(import.meta.url)) + '/dist',
      firefoxProfile: 'Sha Dou'
    }),
  ],

  resolve: {
    extensions: ['.ts', '.js'],
  },

  mode: 'none'
}
