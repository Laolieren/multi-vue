const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
let glob = require("glob");
//配置pages多页面获取当前文件夹下的html和js
function getEntry(globPath) {
  let entries = {},
    tmp,
    htmls = {};
  // 读取src/pages/**/底下所有的html文件
  glob.sync(globPath + "html").forEach(function (entry) {
    tmp = entry.split("/").splice(-3);
    htmls[tmp[1]] = entry;
  });
  // 读取src/pages/**/底下所有的js文件
  glob.sync(globPath + "js").forEach(function (entry) {
    tmp = entry.split("/").splice(-3);
    entries[tmp[1]] = {
      entry,
      //  当前目录没有有html则以共用的public/index.html作为模板
      template: htmls[tmp[1]],
      //  以文件夹名称.html作为访问地址
      filename: tmp[1] + ".html",
    };
  });
  return entries;
}
let htmls = getEntry("./src/pages/**/*.");
module.exports = {
  pages: htmls,
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  css: {
    // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
    // extract: true,

    // 是否开启 CSS source map？
    // sourceMap: false,
    sourceMap: true,

    // 为预处理器的 loader 传递自定义选项。比如传递给
    // sass-loader 时，使用 `{ sass: { ... } }`。
    loaderOptions: {
      sass: {
        implementation: require("node-sass"), // This line must in sass option
      },
    },

    requireModuleExtension: true,
  },
  devServer: {
    port: 9528,
    open: true,
    index: "/index.html",
    inline: true,
    hot: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      "/api": {
        target: "http://yuanqutest.yunyangaiot.com/api/",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    devtool: "source-map",
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    performance: {
      hints: false,
    },
  },
  chainWebpack(config) {
    config.when(process.env.NODE_ENV === "development", (config) =>
      config.devtool("cheap-source-map")
    );
    config.when(process.env.NODE_ENV !== "development", (config) => {
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      // 压缩代码
      config.optimization.minimize(true);
      config.optimization.minimizer("terser").tap((args) => {
        // 注释console.*
        args[0].terserOptions.compress.drop_console = true;
        // remove debugger
        args[0].terserOptions.compress.drop_debugger = true;
        // 移除 console.log
        args[0].terserOptions.compress.pure_funcs = ["console.log"];
        return args;
      });
      config.optimization.runtimeChunk("single");
    });
  },
};
