 var HtmlWebpackPlugin = require('html-webpack-plugin');
 var CopyWebpackPlugin = require('copy-webpack-plugin')
 var path = require('path');
 var merge = require('webpack-merge');
 var common = require('./webpack.common.js');

 module.exports = merge(common, {
	mode: 'production'
 });