const merge = require('webpack-merge')
const common = require('./webpack.common')

const dev = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    proxy: {
      '/app': {
        target: 'https://ybhackathon-service.apps.openshift.ims.ch',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug'
      }
    }
  }
}

module.exports = merge(common, dev)
