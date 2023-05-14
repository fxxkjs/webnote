const { defineConfig } = require('@vue/cli-service')
// Gzip
const CompressionPlugin = require("compression-webpack-plugin");
// 包分析器
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = defineConfig({
  configureWebpack:{
    plugins: [
      new CompressionPlugin({ filename: '[path][name].gz', test: /\.(js|css)$/i }),
      // new BundleAnalyzerPlugin()
    ],
  },
  // 默认忽略 node_modules 中的文件
  transpileDependencies: true,
  // eslint
  lintOnSave: false,
  // 不需要 source map 加速生产环境构建
  productionSourceMap: false,
  // 本地代理
  devServer: {
    proxy: "http://127.0.0.1:65535"
  },
})
