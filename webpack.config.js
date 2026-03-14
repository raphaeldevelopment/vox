import path from "path";
import webpack from "webpack";

const isDebug = process.env.VOX_DEBUG === "true";

function makeConfig({ name, entry, filename, type, outputModule = false, clean = false }) {
  return {
    name,
    mode: "production",
    cache: false,
    entry,
    output: {
      path: path.resolve("dist"),
      filename,
      library: {
        type,
      },
      clean,
    },
    experiments: outputModule ? { outputModule: true } : undefined,
    plugins: [
      new webpack.DefinePlugin({
        __VOX_DEBUG__: JSON.stringify(isDebug),
      }),
    ],
    stats: "normal",
    optimization: {
        realContentHash: false
    },
    resolve: {
        alias: {
            "@vox/core": path.resolve("./src/core"),
            "@vox/components": path.resolve("./src/components")
        }
    }
  };
}

export default [
  makeConfig({
    name: "root-esm",
    entry: "./src/index.js",
    filename: "vox.esm.js",
    type: "module",
    outputModule: true,
    clean: true,
  }),
  makeConfig({
    name: "root-cjs",
    entry: "./src/index.js",
    filename: "vox.cjs",
    type: "commonjs2",
  }),
  makeConfig({
    name: "core-esm",
    entry: "./src/core/index.js",
    filename: "core/vox.esm.js",
    type: "module",
    outputModule: true,
  }),
  makeConfig({
    name: "core-cjs",
    entry: "./src/core/index.js",
    filename: "core/vox.cjs",
    type: "commonjs2",
  }),
];