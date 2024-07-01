const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  entry: {
    index: {
      import: './src/index.js',
      dependOn: 'shared',
    },
    nav: {
      import: './src/nav.js',
      dependOn: 'shared',
    },
    shared: 'lodash',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
			{
				test: /\.(ttf|woff|woff2)$/,
				use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'fonts/',
              publicPath: '/fonts/',
            },
          },
        ]
			},
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new MonacoWebpackPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all', // Enable code splitting
    },
  },
  devServer: {
    compress: true,
    port: 9000,
  },
};
