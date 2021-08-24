module.exports = {
  productionSourceMap: false,
  publicPath: '',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '租借管理系統',
      author: 'ツキノリュウ',
      description: '輕鬆管理您的租賃品狀況。'
    },
  },
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/scss/_mixin.scss";`
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
    config.module.rule('images')
      .test(/\.(png|jpe?g|gif)(\?.*)?$/)
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({ bypassOnDebug: true });
  },
}