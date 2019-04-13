/**
 * 本配置文件分两种情况：development 模式和 production 模式
 * 两种情况下的 build 流程都包括以下操作：
 *
 * 1. 相同的入口在 src/index.ts
 * 2. 相同的输出在 dist/bundle.js
 * 3. 编译前代码会先用 tslint 检查语法错误
 * 4. 使用 TypeScript 进行编译代码
 * 5. 使用 html-webpack-plugin 根据模板生成 html 文件并指向生成的 js
 * 6. 2种模式下都会生成 sourcemap
 *
 * 2个模式下的区别在于：
 * 1. development 模式下，tslint 检查的语法标记为 warning, 不影响开发
 *   但是 production 模式下的 tslint 报错会标记为 error 并阻碍 build
 * 2. production 模式下，增加对代码进行 uglify
 *
 * 两种模式的判定：
 * 由 webpack 的 cli 参数方式传入，env.mode 不等于 'production' 时，
 * 统一认为 mode 为 development
 */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')


const srcPath = path.resolve(__dirname, 'src')
const publicPath = path.resolve(__dirname, 'public')
const distPath = path.resolve(__dirname, 'dist')
const tsconfigPath = path.resolve(__dirname, 'tsconfig.json')

module.exports = (env) => {
  const mode = (env && env.mode === 'production') ? 'production' : 'development'
  const production = mode === 'production'

  return {
    mode,
    entry: path.resolve(srcPath, 'index.tsx'),
    output: {
      filename: 'bundle.js',
      path: distPath,
    },
    resolve: {
      plugins: [new TsconfigPathsPlugin({configFile: tsconfigPath})],
      extensions: ['.js', '.ts', '.tsx', '.jsx'],
    },
    devtool: 'inline-source-map',
    devServer: {
      port: 3000,
    },
    module: {
      rules: [
        {
          test: /\.[tj]sx?$/,
          enforce: 'pre',
          use: [{
            loader: 'tslint-loader',
            options: {
              failOnHint: production,
            },
          }],
          exclude: /node_modules/,
        },
        {
          test: /\.([tj])sx?$/,
          use: 'ts-loader',
          exclude: [/node_modules/, /__tests__/],

        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(publicPath, 'index.html'),
      }),
    ],
    ...(production && {
      optimization: {
        minimizer: [new UglifyJsWebpackPlugin({
          cache: true,
          parallel: true,
        })],
      },
    }),
  }
}
