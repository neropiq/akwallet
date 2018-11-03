const path = require("path");
var webpack = require("webpack");


module.exports = {
    entry: {
        main: "./src/index.tsx"
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]      
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    performance: { hints: false },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }, {
                test: /\.s?css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }, {
                test: /\.(png|svg|jpg|gif|woff)$/,
                use: [
                    'file-loader'
                ]
            },
            { test: /malihu-custom-scrollbar-plugin/, loader: "imports?define=>false&this=>window" }
        ]
    },
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        historyApiFallback: true
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};