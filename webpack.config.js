
const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./src/handler.ts",
    target: "node",
    output: {
        libraryTarget: "commonjs",
        path: path.join(__dirname, "dist"),
        filename: "handler.js"
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.ts$/,
                loader: "tslint-loader",
                exclude: /(node_modules)/,
                options: {
                    fix: true
                }
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    performance: {
        hints: false
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
};

if (process.env.NODE_ENV === "production") {
    module.exports.plugins = (module.exports.plugins || []).concat([
        // new webpack.DefinePlugin({
        //     "process.env": {
        //         NODE_ENV: '"production"'
        //     }
        // }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]);
}

if (process.env.NODE_ENV === "development") {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: '"development"'
            }
        })
    ]);
}