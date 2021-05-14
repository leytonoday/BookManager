module.exports = {
  pluginOptions: {
      electronBuilder: {
          nodeIntegration: true,
          builderOptions: {
            productName: "Book Manager",
            win: {
              icon: "./electron-assets/icon.png"
            },
          },
      }
  },
  devServer: {
    host: "localhost",
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
      }
    }
  },
}