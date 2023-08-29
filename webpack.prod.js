const { merge } = require('webpack-merge');
const common = require('./webpack.config');

module.exports = merge(common, {
	mode: 'production',
	devtool: false,
	// performance: { // Enable to allow bigger sizer limit
	// 	hints: false,
	// 	maxEntrypointSize: 512000,
	// 	maxAssetSize: 512000,
	// },
});
