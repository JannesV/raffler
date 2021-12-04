import HtmlWebpackPlugin from 'html-webpack-plugin';
import { join, resolve } from 'path';
import darkTheme from '@ant-design/dark-theme';
import { Configuration } from 'webpack';
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: Configuration = {
  mode: isDevelopment ? 'development' : 'production',
  devtool: 'source-map',
  entry: join(__dirname, 'src', 'index.tsx'),
  output: {
    path: resolve(__dirname, 'dist')
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all'
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript', '@babel/preset-react'],
            plugins: [
              isDevelopment && require.resolve('react-refresh/babel')
            ].filter(Boolean)
          }
        }
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader' // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: {
                // If you are using less-loader@5 please spread the lessOptions to options directly
                modifyVars: {
                  ...darkTheme,
                  'primary-color': '#e88700',
                  'link-color': '#e88700',
                  'border-radius-base': '5px'
                },
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true // webpack@2.x and newer
            }
          }
        ]
      }
    ]
  },
  devServer: {
    hot: true,
    proxy: {
      '/steamapi': {
        target: 'https://store.steampowered.com',
        pathRewrite: {
          '^/steamapi': '/api'
        },
        secure: false,
        changeOrigin: true
      },
      options: {
        logLevel: 'debug'
      }
    }
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: join(__dirname, 'src', 'index.html')
    }),
    isDevelopment && new ReactRefreshWebpackPlugin()
    // new BundleAnalyzerPlugin(),
  ].filter(Boolean)
};

export default config;
