import path from "path";

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
        }
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