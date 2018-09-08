 var HtmlWebpackPlugin = require('html-webpack-plugin');
 var CopyWebpackPlugin = require('copy-webpack-plugin')
 var path = require('path');
 var merge = require('webpack-merge');
 var common = require('./webpack.common.js');

 module.exports = merge(common, {
	mode: 'development',

	devServer: {
		contentBase: './build',
		host: '0.0.0.0',
		open: true
	},

	devtool: 'source-map',
 });