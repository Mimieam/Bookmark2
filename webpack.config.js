const path = require('path');
const glob = require('glob')
const {
    NpmAutoInstallWebpackPlugin
} = require("npm-auto-install-webpack-plugin");
const webpack = require('webpack')
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const preprocess = require('svelte-preprocess');
const {
    ESBuildMinifyPlugin
} = require('esbuild-loader')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');

const fs = require('fs');

const { FixSWChunks } = require('./webpack.fixswchunk.plugin');

//  webpack --progress --stats-error-details --stats-children --env dev
//  webpack --progress --stats-error-details --stats-children --env production

const PATHS = {
    root: path.join(__dirname, ''),
    app: path.join(__dirname, 'app'),
    scripts: path.join(__dirname, 'app/scripts'),
    dist: path.join(__dirname, 'dist'),
};


let package = require('./package.json');

function modify(buffer) {
  let version = fs.readFileSync(`${PATHS.root}/.ts2_version`, 'utf8')
    var manifest = JSON.parse(buffer.toString());

  // let [major, minor, revision] = manifest.version.split('.');
  let [major, minor, revision] = version.split('.');
  revision = parseInt(revision) + 1;
  const newVersion = `${major}.${minor}.${revision}`;
    // make any modifications you like, such as
    manifest.version = newVersion

    // pretty print to JSON with two spaces
    manifest_JSON = JSON.stringify(manifest, null, 2);
    fs.writeFileSync(`${PATHS.root}/.ts2_version` , newVersion,{encoding:'utf8',flag:'w'})
    return manifest_JSON;
}


module.exports = (env) => {
  env = env || {}

  const devMode = env.production? false: true;
  console.log(`devMode: ${devMode}`)
  console.log(`env.production?: ${env.production}`)

  return {
    mode: devMode ? 'development' : 'production',
    entry: {
      'popup.js': './app/popup/index.js',
      // 'background.modular.js': './app/scripts/background.modular.js',
      // 'bg-sw.js': ['./app/scripts/bg-sw.js'],
      'bg-sw.js': ['./app/scripts/background.modular.js'],
      'workspace.js': './app/popup/pages/workspace.js',
      // 'contentScript.js': './a pp/scripts/contentScript.js',

      // 'popup.js': { import: ['./app/popup/index.js', './app/scripts/popup.js'], dependOn: 'vendors' },
      // 'bg-sw.js': { import: ['./app/scripts/background.modular.js'], dependOn: 'vendors' },
      // 'vendors': { import:  ['mixpanel-browser', 'webextension-polyfill', 'ExtPay', 'svelte','lz-string', 'file-saver'], runtime: 'runtime' },
    },
    output: {
      path: PATHS.dist,
      filename: '[name]',
      devtoolModuleFilenameTemplate: (info) => 'file://' + path.resolve(info.absoluteResourcePath)
    },

    optimization: {
      minimize: true,
      concatenateModules: false,  // THIS CRAP MAKES PROD BUILD FAILED WHEN CHUNKING
      minimizer: [
        new ESBuildMinifyPlugin({
          target: "es2015",
        }),
      ],
      sideEffects: true,
      usedExports: true,
      // runtimeChunk: 'single', // this also breaks crap!
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors.js',
            enforce: true,
            reuseExistingChunk: true,
            minChunks: 1,

            // https://stackoverflow.com/questions/54425302/browser-extension-is-not-working-with-code-splitting
            chunks: 'all'
          },
          // styles: {
          //   name: 'styles',
          //   test: /\.css$/,
          //   chunks: 'all',
          //   enforce: true
          // },
        }
      },
      // minimizer: [
      //   new ESBuildMinifyPlugin({
      //     target: "es2015", // Syntax to compile to (see options below for possible values)
      //   }),
      // ],
      // sideEffects: true,
      // usedExports: true,
    },
    // webpack uses evals in dev mode which causes and CSP unsafe eval error
    // setting inline-cheap-source-map removes the use of evals in the bundled file
    devtool: devMode ? 'source-map' : false,
    devServer: {
      contentBase: PATHS.dist,
      watchContentBase: true,
      inline: true,
      hot: true,
    },

    watch: !!devMode,
    watchOptions: {
      ignored: "/node_modules/",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          resolve: {
            extensions: ['.mjs', '.js', '.json']
          },
          use: {
            loader: 'esbuild-loader',

            options: {
              target: 'es2021',
            },
          },
        },
        {
          test: /\.(svelte)$/,
          use: {
            loader: 'svelte-loader',
            options: {
              emitCss: true,
              preprocess: preprocess({
                postcss: true,
              })
            },
          },
        },
        {
          test: /\.(p?css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                url: false, // necessary if you use url('/path/to/some/asset.png|jpg|gif')
              }
            },
            // 'postcss-loader'
          ],
          sideEffects: true
        },
        //Allows use of images
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          use: 'file-loader',
        },
        {
          test: /\.svg$/,
          type: 'asset'
        },
        {
          test: /\.(html)$/,
          use: {
            loader: 'html-loader',
          },
        },
      ],
    },
    resolveLoader: {
      modules: [
        path.join(__dirname, 'node_modules')
      ]
    },
    resolve: {
      symlinks: false,
      extensions: ['.mjs', '.js', '.svelte'],
      alias: {
        '@app': path.resolve('app'),
        '@store': path.resolve('app/popup/components/store/'),
        '@assets': path.resolve('app/images/'),
      },
      modules: [
        path.join(__dirname, 'node_modules')
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
      // new webpack.HotModuleReplacementPlugin(),

      // new webpack.SourceMapDevToolPlugin({}),

      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: 'x`[id].css'
      }),

      new HtmlWebpackPlugin({
        // inject: true,
        // hash: true,
        template: path.join(__dirname, 'app', 'popup.html'),
        filename: 'popup.html',
        inject: 'body',
        chunks: ['vendors.js', 'popup.js'],
        chunksSortMode: 'manual',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      }),
      new PreloadWebpackPlugin({
        rel: "preload",
        include: ['vendors.js', 'popup.js']
      }),

      // new HtmlWebpackPlugin({
      //   // inject: true,
      //   hash: true,
      //   template: path.join(__dirname, 'app', 'options.html'),
      //   filename:  `options.html`,
      //   chunks: ["options.js"],
      // }),
      new HtmlWebpackPlugin({
        // inject: true,
        hash: false,
        template: path.join(__dirname, 'app', 'bifrost.html'),
        filename: `bifrost.html`,
        chunks: ["contentScript.js"],
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      }),
      new HtmlWebpackPlugin({
        // inject: true,
        hash: false,
        template: path.join(__dirname, 'app', 'workspace.html'),
        filename: `workspace.html`,
        chunks: ["workspace.js"],
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      }),
      new CopyPlugin({
        patterns: [
          {
            from: "./app/manifest.json",
            to: "./manifest.json",
            transform(content, path) {
              return modify(content)
            }
          },
          {
            from: "./app/_locales/",
            to: "./_locales/",
          },
          {
            context: "./app/",
            from: "./images/icon*",
            to: "./",
          },
        ]
      }),
      new FixSWChunks(),
      new BundleAnalyzerPlugin()
    ],
  }
}
