 var HtmlWebpackPlugin = require('html-webpack-plugin');
 var CopyWebpackPlugin = require('copy-webpack-plugin')
 var path = require('path');
 var webpack = require('webpack');

 module.exports = {
	entry: './js/main.js',

	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'main.bundle.js'
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2016']
				}
			}
		]
	},

	stats: {
		colors: true
	},
	
	plugins: [
		new HtmlWebpackPlugin(),
		new CopyWebpackPlugin([{ from: 'assets', to: 'assets' }])
	]
 };