const path    = require ('path');
const webpack = require ('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	entry : {
		'dashboard'        : './app/dash/init.jsx',
		'class'            : './app/class/init.jsx',
		'license-template' : './app/license-template/init.jsx',
		'license-instance' : './app/license-instance/init.jsx',
		'org'              : './app/org/init.jsx',
		'user'             : './app/user/init.jsx',
		'roles'            : './app/roles/init.jsx',
	},
	output : {
		path : path.join(__dirname, './dist'),
		filename : "[name]-bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					allChunks : true,
					fallback: "style-loader",
					use: [
						{ loader: 'css-loader', options: { minimize: true } },
					]
				})
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [ 'file-loader' ]
			},
			{
				test: /\.jade$|\.pug$|\.txt$/,
				use: [ 'raw-loader' ]
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'less-loader',
						options: {
							paths: [
								path.join (__dirname, 'app/less')
							]
						}
					}
				],
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader',
						options: {
							paths: [
								path.join (__dirname, 'app/less')
							]
						}
					}
				],
			},
		],
	},
	plugins : [
		new webpack.ProvidePlugin({
			'$'            : 'jquery',
			jquery         : "jquery",
			"window.jQuery": "jquery",
			jQuery         : "jquery"
		}),

		new ExtractTextPlugin ({
			filename : (getPath) => {
			      return getPath('css/[name].css').replace('css/js', 'css');
			    },
			allChunks : true,
		}),

		new BundleAnalyzerPlugin({
			analyzerHost : '0.0.0.0'
		}),

		new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0
		}),
		new CleanWebpackPlugin(['dist']),
	],
	optimization : {
		splitChunks: {
			cacheGroups: {
				commons: {
					name: "commons",
					chunks: "initial",
					minChunks: 2,
				}
			}
		}
	},
	resolve : {
		alias : {
			'jquery'     : path.join (__dirname, './vendors/jquery/dist/jquery.min.js'),
			'datepicker' : path.join (__dirname, './vendors/datepicker/js/bootstrap-datetimepicker.min.js'),
			'dom_ready'  : path.join (__dirname, './app/domReady.js'),
			'jsonview'   : path.join (__dirname, './vendors/jquery-jsonview/jquery.jsonview.min.js'),
			'm_install'  : path.join (__dirname, './../../../../../m_install/'),
		}
	}
};
