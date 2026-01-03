const path = require("path");

module.exports = {
    mode: "development",
    target: "electron-renderer",
    entry: "./src/main.ts",
    output: {
        path: path.resolve(__dirname, "lib"),
        filename: "main.js",
        library: {
            type: "commonjs2"
        }
    },
    resolve: {extensions: [".ts", ".tsx"]},
    module: {
        rules: [
            {
                use: {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },
    externals: {
        "mailspring-exports": "commonjs mailspring-exports",
        "mailspring-component-kit": "commonjs mailspring-component-kit"
    },
    devtool: "source-map",
};
