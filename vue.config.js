module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  publicPath: process.env.BASE_URL,
  transpileDependencies: ['vuetify'],

  pluginOptions: {
    i18n: {
      locale: 'ar',
      fallbackLocale: 'ar',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}
