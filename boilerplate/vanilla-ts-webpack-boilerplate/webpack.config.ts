import * as path from 'node:path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as webpack from 'webpack';
import 'webpack-dev-server';
import merge from 'webpack-merge';

const commonConfig: webpack.Configuration = {
  resolve: {
    extensions: ['.ts', '.js'],
  },
  entry: {
    main: './src/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
  ],
};

const developmentConfig: webpack.Configuration = {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  devServer: {
    historyApiFallback: true,
    port: 4000,
  },
};

const productionConfig: webpack.Configuration = {
  mode: 'production',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
};

export default (env: { [key: string]: boolean }) =>
  env.WEBPACK_SERVE
    ? merge(commonConfig, developmentConfig)
    : merge(commonConfig, productionConfig);
