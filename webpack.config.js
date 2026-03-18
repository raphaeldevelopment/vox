import path from "path";

const common = {
  mode: "production",
  entry: "./src/index.ts",
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
            transpileOnly: true
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
