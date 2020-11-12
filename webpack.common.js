const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default

module.exports = {
  //游戏入口文件
  context: path.join(__dirname, 'src'),
  entry: ['./js/main.js'],
  output: {
    //js文件最终发布到哪个路径
    path: path.resolve(__dirname, 'dist'),
 
    //开发调试阶段webpack会自动处理这个文件让html引用到，虽然磁盘上不会有这个文件。
    //但是最终发布项目的时候会生成这个文件，并会插入到index.html中。
    //[hash:8]的意思是生成随机的八位hash值，为了缓存更新问题。
    filename: 'game.min.[hash:8].js',
  },
  target: 'web',

plugins: [
  //拷贝src/assets目录下的所有资源到dist/assets下
  new CopyWebpackPlugin([
    { from: 'assets/',to:'assets/'}
  ], {
    ignore: [],
    debug:'debug',
    copyUnmodified: true
  }),
  
  //优化图片资源，压缩png。
  new ImageminPlugin({
    test: /\.(jpe?g|png|gif|svg)$/i ,

    //这种方式压缩在mac上效果不太好
    // optipng: {
    //   optimizationLevel: 4
    // },

    //这个方式在mac上压缩效果更好,windows上尚未测试有待验证。
    pngquant: {
      verbose:true,
      quality: '80-90',
    }
  })
  
  //拷贝html，插入js。
  ,new HtmlPlugin({
    file:path.join(__dirname,'dist','index.html'),
    template:'./index.html'
  })
]
}