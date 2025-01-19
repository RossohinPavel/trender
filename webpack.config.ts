import webpack from 'webpack';
import path from "path";
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";


const mode = process.env.mode || 'development';
const scriptPath = mode === 'development' ? './src/index.ts' : './src/app/main.ts';


const devServer: DevServerConfiguration = {
    historyApiFallback: true,
    watchFiles: path.resolve(__dirname, './src'),
    open: true,
    compress: true,
    hot: true,
    port: 8080
}


const config: webpack.Configuration = {
    mode: mode as webpack.Configuration['mode'],
    entry: {
        trender: path.resolve(__dirname, scriptPath)
    },
    output: {
        path: path.resolve(__dirname, './dist'),
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
        extensions: [".wasm", ".ts", ".tsx", ".mjs", ".cjs", ".js", ".json"],
  },
    plugins: [],
}


if ( mode === 'production' ) {
    config.plugins.push(new CleanWebpackPlugin());
    config.output.libraryTarget = 'umd';
} else {
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin(
            {
                title: 'Trender test page',
                template: path.resolve(__dirname, './src/index.html'), // шаблон
                filename: 'index.html', // название выходного файла
            }
        )
    )
    config.devServer = devServer;
}


export default config;
