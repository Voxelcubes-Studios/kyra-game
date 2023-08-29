const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		bundle: path.resolve(__dirname, 'src/index.ts'),
	},
	output: {
		publicPath: '/',
		filename: '[name][contenthash].js',
		path: path.resolve(__dirname, 'dist'),
		assetModuleFilename: '[name][ext]',
		clean: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'src/app/levels/level1/level1.html',
			minify: {
				minifyCSS: true,
				minifyJS: true,
			},
		}),
	],
	module: {
		rules: [
			{
				test: /\.html$/i,
				use: [
					{
						loader: 'html-loader',
					},
				],
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},

			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
						},
					},
				],
			},
			{
				test: /\.s[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/images/[name][ext]',
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[name][ext]',
				},
			},
			{
				test: /\.(mp3|wav)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/sounds/[name][ext]',
				},
			},
			{
				test: /\.(glb|gltf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/glb/[name][ext]',
				},
			},
			{
				test: /\.(env)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/env/[name][ext]',
				},
			},
			{
				test: /\.(babylon)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/levels/[name][ext]',
				},
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/levels/[name][ext]',
				},
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.json'],
	},
	devtool: 'source-map',
};
