const path = require('path');
//const {GenerateSW} = require('workbox-webpack-plugin');

module.exports = {
  // モードの設定、v4系以降はmodeを指定しないと、webpack実行時に警告が出る
  mode: 'development',
  devServer: {
    static: "dist",
    port : 5025
  },
  resolve : {
    extensions : [".ts",".js"]
  },
  // エントリーポイントの設定
  entry: './src/js/index.js',
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: 'index.js',
    // 出力先のパス（絶対パスを指定する必要がある）
    path: path.join(__dirname, 'public/static/js')
  },
  plugins : [

  ]
};