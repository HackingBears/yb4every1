const merge = require('webpack-merge')
const common = require('./webpack.common')

const dev = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: 'https://yb-hackathon.apps.openshift.ims.ch',
        secure: false
      }
    }
  }
}

module.exports = merge(common, dev)
