import path from "path";

const common = {
  mode: 'production',
  entry: "./src/index.ts",
  cache: false,
  watchOptions: {
    poll: 1000,
    ignored: /node_modules/
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: false,
            configFile: "tsconfig.webpack.json"
          }
        }
      }
    ]
  }
};

export default [
  {
    ...common,
    output: {
      path: path.resolve("dist"),
      filename: "vox.esm.js",
      library: {
        type: "module"
      },
      module: true
    },
    experiments: {
      outputModule: true
    }
  },
  {
    ...common,
    output: {
      path: path.resolve("dist"),
      filename: "vox.cjs",
      library: {
        type: "commonjs2"
      }
    }
  },
  {
    ...common,
    output: {
      path: path.resolve("dist"),
      filename: "vox.min.js",
      library: {
        name: "Vox",
        type: "umd"
      }
    }
  }
];