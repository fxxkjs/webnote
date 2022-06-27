const path = require('path');
const webpack = require('webpack')
// gzip
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 包分析器
// const bundleAnalysis = require("webpack-bundle-analyzer").BundleAnalyzerPlugin



const productionGzipExtensions = ['js', 'css']
module.exports = {

  publicPath: process.env.NODE_ENV === "production" ? './' : '/',
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@i': path.resolve(__dirname, './src/assets'),
      }
    },
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // 配置compression-webpack-plugin压缩
      new CompressionWebpackPlugin({
        // filename: "[path].gz[query]",
        // algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        // deleteOriginalAssets: false
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 2,
        minChunkSize: 100
      }),
      // 包分析器
      // new bundleAnalysis()
    ]

  }
}