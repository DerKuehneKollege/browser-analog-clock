const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/ts/main.ts',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Analog Clock',
            template: './src/index.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/assets", to: "assets" },
                { from: "./src/favicon.ico", to: "favicon.ico"}
            ],
        }),
    ],
    module: {
        rules: [
            // CSS
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            // TypeScript Code
            {
                test: /\.tsx?$/i,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            // Fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: 'source-map',
    devServer: {
        static: './dist',
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
};