import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import RefreshPlugin from "@rspack/plugin-react-refresh";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";

const PATHS = {
	root: path.join(__dirname, ''),
	public: path.join(__dirname, 'public'),
	src: path.join(__dirname, 'src'),
	scripts: path.join(__dirname, 'src/scripts'),
	dist: path.join(__dirname, 'dist'),
};


// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

export default defineConfig({
	context: __dirname,
	devServer:{
		// contentBase: PATHS.dist,
		// watchContentBase: true,
		// inline: true,
		open: ['index.html', 'chrome-extension://fbjabojanllpjoiahoblkjkhbacaicef/index.html'],
		hot: true,
		liveReload: false,
		// server: 'spdy',
		// disableHostCheck: true,
		watchFiles: {
			paths: '**/**/*',
		},
		devMiddleware: {
			index: true,
			mimeTypes: { phtml: 'text/html' },
			publicPath: '/',
			serverSideRender: true,
			writeToDisk: true,
			
		},
	},
	entry: {
		popup: "./src/popup.jsx",
		background: "./src/bg/background.js",
		// content: "./src/content.tsx"
	},
	output: {
		path: PATHS.dist,
		// filename: "[name].[ext]",
		// chunkFilename: "[id].chunk.js",
		clean: true,
	},
	resolve: {
		extensions: ["...", ".ts", ".tsx", ".jsx"]
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset"
			},
			// {
			// 	test: /\.svg$/,
			// 	use: ['@svgr/webpack'],
			// },
			{
				test: /\.(jsx?|tsx?)$/,
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "typescript",
									tsx: true
								},
								transform: {
									react: {
										runtime: "automatic",
										development: isDev,
										refresh: isDev
									}
								}
							},
							env: { targets }
						}
					}
				]
			}
		]
	},
	plugins: [
		new rspack.HtmlRspackPlugin({
			template: "./index.html"
		}),
		new rspack.CopyRspackPlugin({
			patterns: [
				{
					from: './src/manifest.json',
				},
				{
					from: "./src/_locales/",
					to: "./_locales/",
				},
				{
					from: "./src/assets/",
					to: "./assets/",
				},
			],
		}),
		isDev ? new RefreshPlugin() : null
	].filter(Boolean),
	optimization: {
		minimizer: [
			new rspack.SwcJsMinimizerRspackPlugin(),
			new rspack.LightningCssMinimizerRspackPlugin({
				minimizerOptions: { targets }
			})
		]
	},
	experiments: {
		css: true
	}
	
});
