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
    path: rootDir + '/dist',
    clean: true
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './manifest.json', to: '.' },
        { from: './pages/*/*.(html|css)', to: '.' },
        { from: './icons/*', to: '.' },
        { from: './LICENSE', to: '.' },
      ],
    }),
    new WebExtPlugin({
      sourceDir: rootDir + '/dist',
      artifactsDir: rootDir + '/web-ext-artifacts',
      buildPackage: true,
      overwriteDest: true,
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
