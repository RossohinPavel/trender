// webpack.config.js
const path = require('path')


module.exports = [
    {
        mode: 'production',
        entry: {
            trender: path.resolve(__dirname, './src/index.ts'),
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
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].js',
            iife: false
        },
        optimization: {
            minimize: false,
        }
    },
    // {
    //     mode: 'production',
    //     entry: {
    //         main: path.resolve(__dirname, './src/index.js'),
    //     },
    //     output: {
    //         path: path.resolve(__dirname, './dist'),
    //         filename: 'trender.min.js',
    //         iife: false
    //     },
    //     optimization: {
    //         minimize: true,
    //     }
    // },
]