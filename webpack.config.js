let path = require("path");
let HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = dir => path.join(__dirname, '.', dir)

module.exports = {
  mode: 'development',
  entry: "./index.js",
  output: {
    path: path.join(__dirname, "lib"),
    filename: "[name].js",
    library: "qjmind",
    libraryExport: "default",
    libraryTarget: "umd", // var this window ...
  },
  devtool: 'source-map', 
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: "/node_modules/",
      },
    ],
  },
  devServer: {
    contentBase:'./lib',
    host:'localhost',
    port:8000,
    openPage: 'main.html',
    open:true,
    inline:true,
    hot:true,
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template: resolve("./template/template.html"),
  //     filename: "main.html",
  //   }),
  // ],
};
