const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyjsPlugin = require('uglifyjs-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;
//生产环境构建，生成dist代码压缩
const ENV_PROD = NODE_ENV === 'production';
//开发环境构建，启动服务，不压缩代码
const ENV_DEV_SERVER = NODE_ENV === 'dev';

let plugins = [
    new ExtractTextPlugin('style/[name].[chunkhash].css'),
    new webpack.optimize.CommonsChunkPlugin({
      name:'common'
    }),
    new CleanWebpackPlugin(['./dist']),
    new HTMLWebpackPlugin({
      //以目录形式访问页面，不用加.html后缀
      filename:'index.html',
      template:'./src/index.ejs',
      minify:{
        //移除空白
        collapseWhitespace:true,
        //压缩css
        minifyCSS:true,
        //压缩js
        minifyJS:true
      }
    })
]

if(!ENV_DEV_SERVER){
  plugins.push(
    new UglifyjsPlugin()
  )
}

module.exports = {
  entry:'./src/index',
  devServer:{
    port:8081,
    contentBase:'./dist'
  },
  plugins:plugins,
  resolve:{
    extensions:['.js', '.json', '.less', '.css']
  },
  module:{
    rules:[
        {
          test:/\.js$/,
          exclude:/node_modules/,
          use:[{
            loader:'babel-loader',
            options: {
              plugins:[
                [
                  'import', {
                    'libraryName': 'antd',
                    'libraryDirectory': 'es', 
                    'style': true 
                  }
                ]
              ],
              presets:[
                'es2015', 
                'react',
                'stage-0'
              ]
            }
          }]
        },
        {
          test:/\.less$/,
          include:/node_modules/,
          use:ExtractTextPlugin.extract({
            use:[{
              loader:'css-loader',
              options:{
                minimize:!ENV_DEV_SERVER
              }
            }, {
              loader:'less-loader',
              options:{
                //https://github.com/ant-design/ant-design/issues/7927#issuecomment-372513256
                javascriptEnabled:true
              }
            }]
          })
        },
        {
          test:/\.less$/,
          exclude:/node_modules/,
          use:ExtractTextPlugin.extract({
            use:[{
              loader:'css-loader',
              options:{
                modules:true,
                minimize:!ENV_DEV_SERVER
              }
            }, {
              loader:'less-loader',
              options:{
                //https://github.com/ant-design/ant-design/issues/7927#issuecomment-372513256
                javascriptEnabled:true
              }
            }]
          })
        },
        {
          test:/\.(svg|ttf|woff|eot)(\?.*)?$/,
          use: [
            {
              loader:'file-loader',
              options:{
                name:'[name].[hash:7].[ext]',
                publicPath:'./font/',
                outputPath:'font/'
              }
            }
          ]
        },
        {
          test:/\.(png|jpe?g|gif)(\?.*)?$/,
          use: [
            {
              loader:'file-loader',
              options:{
                name:'[name].[hash:7].[ext]',
                publicPath:'./images/',
                outputPath:'images/'
              }
            }
          ]
        }
      ]
  },
  output:{
    filename:'script/[name].[chunkhash].js',
    path:path.resolve(__dirname, './dist')
  }
}