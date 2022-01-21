const webpack = require("webpack")
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const pagesObj = {};
const chromeName = ["popup", "options", "background", "content"];
chromeName.forEach(name => {
  pagesObj[name] = {
    entry: `src/${name}/index.js`,
    filename: `${name}.html`
  };
});

const plugins =
  process.env.NODE_ENV === "production"
    ? [
        {
          from: path.resolve("src/manifest.production.json"),
          to: `${path.resolve("dist")}/manifest.json`
        }
      ]
    : [
        {
          from: path.resolve("src/manifest.development.json"),
          to: `${path.resolve("dist")}/manifest.json`
        }
      ];
module.exports = {
  assetsDir: 'assets',
  pages: pagesObj,
  filenameHashing: false,

  configureWebpack: {
    plugins: [CopyWebpackPlugin(plugins)]
  },
  // pages:{
  //   index:{
  //     entry: 'src/popup/index.js',
  //   }
  // },
  chainWebpack: config => {
    if (process.env.npm_config_report) {
      config
      .plugin('webpack-bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  
  // devServer:{
  //   port:3300,
  //   open:true
  // }
};
