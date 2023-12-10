const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, args) => {
  const isProd = args.mode === 'production'
  const isDev = !isProd

  const filename = (ext) => isProd ? `[name].[contenthash].bundle.${ext}` :
 `[name].bundle.${ext}`

  const plugins = () => {
    const base = [
      new HtmlWebpackPlugin({
        path: './index.html'
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src', 'favicon.ico'),
            to: path.resolve(__dirname, 'dist')
          }
        ],
      }),
      new MiniCssExtractPlugin({
        filename: filename('css')
      })
    ]

isDev ? base.push(new ESLintPlugin()) : ''

return base
  }

  return {

    context: path.resolve(__dirname, 'src'),
    entry: {
      main: ['@babel/polyfill', './index.js']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: filename('js'),
      clean: true
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@core': path.resolve(__dirname, 'src', 'core')
      }
    },
    plugins: plugins(),
    devtool: isDev ? 'source-map' : false,
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ],
    }
  }
}
