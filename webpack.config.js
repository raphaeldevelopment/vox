import path from "path";
import webpack from "webpack";

export default [
    {
        name: "esm",
        mode: "production",
        entry: "./src/index.js",
        output: {
            path: path.resolve("dist"),
            filename: "vox.esm.js",
            library: {
                type: "module"
            },
            clean: true
        },
        experiments: {
            outputModule: true
        },
        plugins: [
            new webpack.DefinePlugin({
                __VOX_DEBUG__: JSON.stringify(process.env.VOX_DEBUG === "true")
            })
        ]
    },
    {
        name: "cjs",
        mode: "production",
        entry: "./src/index.js",
        output: {
            path: path.resolve("dist"),
            filename: "vox.cjs",
            library: {
                type: "commonjs2"
            }
        }
    }
];