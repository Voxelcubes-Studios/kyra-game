const path = require('path');
const common = require('./webpack.config');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
	mode: 'development',
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		watchFiles: ['index.html', './src/app/**/*.html', './src/app/**/**/*.html'],
		compress: true,
		port: 4100,
		open: true,
		hot: true,
		onListening: (server) => {
			server.compiler.hooks.done.tap('done', () => {
				setImmediate(() => {
					console.log('Server as finally started');
				});
			});
		},
	},
});
