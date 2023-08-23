const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const preprocess = require('svelte-preprocess');
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { FixSWChunks } = require('./webpack.fixswchunk.plugin');
const path = require('path');


const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';
const manifest_version = process.env.MANIFEST_VERSION || 3;
const manifest_path = path.join(__dirname, 'src', (manifest_version == 2 ? 'manifest.mv2.json' : 'manifest.mv3.json'))

console.log(`Using Mv${manifest_version}...`, manifest_path)
console.log(`Running in env = ${mode}`)


const PATHS = {
	root: path.join(__dirname, ''),
	public: path.join(__dirname, 'public'),
	src: path.join(__dirname, 'src'),
	scripts: path.join(__dirname, 'src/scripts'),
	dist: path.join(__dirname, 'dist'),
};

const popup_entry = prod? ['./src/popup/index.js']: ['./src/shared/events.js', './src/popup/index.js']

module.exports = {
	entry: {
		'popup.js': popup_entry,
		'bg.js': ['./src/bg/index.js'],
	},
	output: {
		path: PATHS.dist,
		filename: '[name]',
		devtoolModuleFilenameTemplate: (info) => 'file://' + path.resolve(info.absoluteResourcePath)
	},
	resolve: {
		alias: {
			svelte: path.dirname(require.resolve('svelte/package.json')),
			'@store': path.resolve('src/popup/components/store/'),
			'@assets': path.resolve('src/assets/'),
			'@shared': path.resolve('src/shared/'),
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	experiments: {
		topLevelAwait: true
	},
	optimization: {
		minimize: prod,
		concatenateModules: !prod,  // THIS CRAP MAKES PROD BUILD FAILED WHEN CHUNKING
		minimizer: [
			new ESBuildMinifyPlugin({
				target: "es2022",
			}),
		],
		sideEffects: true,
		usedExports: true,
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors.js',
					enforce: true,
					reuseExistingChunk: true,
					minChunks: 1,
					chunks: 'all'
				},
			}
		},
	},

	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						compilerOptions: {
							dev: !prod
						},
						emitCss: true, // if you don't emit it, your plugin will not pick up any imported style.
						preprocess: preprocess({
							postcss: true,
						}),
						target: 'es2022',
						hotReload: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				// required to prevent errors from Svelte on Webpack 5+
				test: /node_modules\/svelte\/.*\.mjs$/,
				resolve: {
					fullySpecified: false
				}
			},
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				resolve: {
					extensions: ['.mjs', '.js', '.json']
				},
				use: {
					loader: 'esbuild-loader',

					options: {
						target: 'es2022',
					},
				},
			},
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
		]
	},
	mode,
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),

		new HtmlWebpackPlugin({
			template: path.join(PATHS.public, 'index.html'),
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

		new CopyPlugin({
			patterns: [
				{
					from: manifest_path,
					to: "./manifest.json",
					// transform(content, path) {
					// 	return modify(content)
					// }
				},
				{
					from: "./src/_locales/",
					to: "./_locales/",
				},
				{
					context: "./src/",
					from: "./assets/icon*",
					to: "./",
				},
			]
		}),

			new FixSWChunks({
				serviceWorker: 'bg.js',
				vendor:'vendors.js',
				manifest_version: manifest_version,
			}),
		new BundleAnalyzerPlugin()
	],
	devtool: prod ? false : 'source-map',
	devServer: {
		contentBase: PATHS.dist,
		watchContentBase: true,
		inline: true,
		hot: true,
		disableHostCheck: true,
		writeToDisk: true
	},
	watch: !prod,
	watchOptions: {
		ignored: "/node_modules/",
		aggregateTimeout: 300,
	},
};
