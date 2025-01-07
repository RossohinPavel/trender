import path from 'path';
import webpack from 'webpack';


const config: webpack.Configuration = 
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
    }
;

export default config;