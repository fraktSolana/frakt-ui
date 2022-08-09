/* eslint-disable @typescript-eslint/no-var-requires */
const Webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

require('dotenv').config({ path: './.env' })
require('dotenv').config({ path: './.env.local' })

module.exports = {
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'build'),
    filename: '[name]-[contenthash].js'
  },
  mode: 'production',
  entry: {
    index: './src/index.tsx'
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader')
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-modules-typescript-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "images/[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader'
          },
        ]
      },
      {
        test: /.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    fallback: {
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify")
    }
  },
  plugins: [
    new HTMLWebpackPlugin({ 
      template: './public/index.html',
      favicon: './public/favicon.ico',
      filename: 'index.html',
      manifest: './public/manifest.json', }),
    new Webpack.ProvidePlugin({ process: 'process/browser' }),
    new Webpack.DefinePlugin({ 'process.env': JSON.stringify(process.env) })
  ]
}
