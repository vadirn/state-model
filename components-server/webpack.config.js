const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pkg = require('../package.json');

const settings = {
  version: pkg.version,
};

const extractGlobalCSS = new ExtractTextPlugin({
  filename: `global.v${settings.version}.css`,
  disable: false,
  allChunks: true,
});

const extractCSS = new ExtractTextPlugin({
  filename: `main.v${settings.version}.css`,
  disable: false,
  allChunks: true,
});

const postcssOptions = {
  config: {
    path: path.resolve(__dirname, '..', 'postcss.config.js'),
  },
};

const options = {
  devtool: 'eval',
  entry: {
    main: path.resolve(__dirname, 'main.js'),
    vendor: [
      // 'get-object-property',
      'history',
      'object-state-storage',
      'react-dom',
      'components-di',
      'react',
      'session-controller',
      'superagent',
      'hoist-non-react-statics',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build', 'assets'),
    filename: `[name].v${settings.version}.js`,
    publicPath: '/assets/',
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'modules'),
      path.resolve(__dirname, '..', 'node_modules'),
      path.resolve(__dirname, '..', 'modules'),
    ],
    alias: {
      components: path.resolve(__dirname, '..', 'src', 'ui', 'components'),
      views: path.resolve(__dirname, '..', 'src', 'ui', 'views'),
      controllers: path.resolve(__dirname, '..', 'src', 'controllers'),
      utils: path.resolve(__dirname, '..', 'src', 'utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, '..', 'src'),
          path.resolve(__dirname, '..', 'modules'),
          path.resolve(__dirname, 'modules'),
          path.resolve(__dirname, 'node_modules', 'object-state-storage'),
          path.resolve(__dirname, 'node_modules', 'session-controller'),
          path.resolve(__dirname, 'node_modules', 'get-object-property'),
          path.resolve(__dirname, 'node_modules', 'components-di'),
          path.resolve(__dirname, 'main.js'),
        ],
        loader: 'babel-loader',
        options: {
          presets: [
            [
              'env',
              {
                useBuiltIns: true,
                debug: false,
                targets: {
                  browsers: ['last 3 versions'],
                  modules: false,
                  loose: true,
                },
              },
            ],
            'react',
          ],
          plugins: ['transform-object-rest-spread', 'syntax-dynamic-import'],
        },
      },
      {
        test: /global\.css$/,
        use: extractGlobalCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[local]',
              },
            },
            {
              loader: 'postcss-loader',
              options: postcssOptions,
            },
          ],
        }),
      },
      {
        test: /\.css$/,
        exclude: [/global\.css$/],
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: postcssOptions,
            },
          ],
        }),
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: ['file-loader?hash=sha512&digest=hex&name=[hash].[ext]'],
      },
      {
        test: /\.(svg)$/i,
        use: ['file-loader?name=[name].[ext]'],
      },
    ],
  },
  plugins: [
    extractGlobalCSS,
    extractCSS,
    // explicit vendor chunks
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['manifest'],
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        APP_ENV: JSON.stringify('development'),
        VERSION: JSON.stringify('development'),
      },
    }),
  ],
  watchOptions: {
    aggregateTimeout: 100,
  },
};

module.exports = options;
