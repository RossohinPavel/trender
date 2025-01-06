// webpack.config.js
const path = require('path')


module.exports = [
    {
        mode: 'production',
        entry: {
            main: path.resolve(__dirname, './src/index.js'),
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'trender.js',
            iife: false
        },
        optimization: {
            minimize: false,
        }
    },
    {
        mode: 'production',
        entry: {
            main: path.resolve(__dirname, './src/index.js'),
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'trender.min.js',
            iife: false
        },
        optimization: {
            minimize: true,
        }
    },
]