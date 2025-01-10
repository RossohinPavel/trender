const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')


module.exports = {
    mode: 'development',
    devServer: {
        historyApiFallback: true,
        watchFiles: path.resolve(__dirname, '../src'),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    entry: {
        main: path.resolve(__dirname, '../src/index.ts'),
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Trender test page',
            template: path.resolve(__dirname, '../src/index.html'), // шаблон
            filename: 'index.html', // название выходного файла
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
};