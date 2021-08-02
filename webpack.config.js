const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
        compress: true, // enable gzip compression
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths,
        port: 8000,
        writeToDisk: true,
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
      },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
          template: './public/index.html'
      }),
      new CopyPlugin({
        patterns: [{
          from: './public/assets',
          to: 'assets'
        }]
      })
    ],
    optimization: {
      minimize: true,
      minimizer: [
        (compiler) => {
            const TerserPlugin = require('terser-webpack-plugin');
            new TerserPlugin({
              terserOptions: {
                toplevel: true,
                compress: {
                  drop_console: false,
                  drop_debugger: true,
                },
                output: {
                  comments: false,
                },          
              }
            }).apply(compiler);
        },
      ],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };