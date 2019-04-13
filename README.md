# Buckle-Up TypeScript

TypeScript scaffold

## How to use

目前的使用方法是复制粘贴，且没有太明确的升级规则

## TODO

未来希望这个项目可以做成

- [x] 支持 React 相关配置
- [ ] 工具化之前要搭建内部 npm registry: [verdaccio](https://verdaccio.org/)
- [ ] 工具 CLI 化，可以使用指令生成项目，且拥有很多必要的配置项
- [ ] 支持 Vue 相关配置
- [ ] 潜在的 OOP 相关配置
- [ ] 内部包？
- [ ] ts 的 declaration 生成

## How it works

参考配置文件顶部注释（webpack.config.js）

以后这些原理介绍考虑放出来

## 工具化的思路

首先是把工具作为一个 npm 包发布，这个包的功能要做到：

- 【需要调研】 在内部动态增加项目的依赖项
- 内部提供多版本的配置文件：比如基于 ts 的 OOP 开发用，React 用，vue 用，etc.

然后生成的项目，在 package.json 中可以有：

```
"start": "bu-ts dev",
"build": "bu-ts build production",
"test": "bu-ts test",
"coverage": "bu-ts coverage",
```

执行 `bu-ts` 指令的时候，bu-ts 假设已经或可以加载对应的依赖项（但是要考虑不用 React
的项目不要事先安装 React），然后从 *node_modules/@buckle-up/ts* 中加载对应的
*webpack.config.js* 文件，并对用户指定的配置合并，再执行相关指令。
