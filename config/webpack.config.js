const { resolve: resolvePath, join: joinPath } = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDev = process.env["NODE_ENV"] === "development";

const ROOT = resolvePath(__dirname, "..");
const PATHS = {
  src: resolvePath(ROOT, "./src"),
  dist: resolvePath(ROOT, "./dist"),
  node_modules: resolvePath(ROOT, "./node_modules"),
  publicUrl: "/"
};

module.exports = {
  mode: isDev ? "development" : "production",
  devtool: "source-map",

  devServer: {
    contentBase: PATHS.dist,
    hot: true
  },

  entry: {
    client: [joinPath(PATHS.src, "./index.tsx")]
  },

  output: {
    filename: "[name].[hash].bundle.js",
    path: PATHS.dist,
    publicPath: isDev ? "/" : PATHS.publicUrl
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      "@": PATHS.src,
      // Force svg-arc-to-cubic-bezier to use the cjs build, due to
      //  breaking change on 3.1.0 when ran against normalize-svg-path
      "svg-arc-to-cubic-bezier": joinPath(
        PATHS.node_modules,
        "svg-arc-to-cubic-bezier/cjs"
      )
    }
  },

  module: {
    rules: [
      // Process source maps in input sources
      //  All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        loader: "source-map-loader"
      },

      //  Run typescript through react-hot-loader to rewrite react components for hot loading.
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrc: false,
              plugins: ["react-hot-loader/babel"]
            }
          },
          "ts-loader"
        ]
      },

      // css support.
      //  style-loader can do a lot more than we use it for;
      //  we currently just use it to inject the css into the html.
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },

      // Pull in text and markdown files raw.
      {
        test: /\.(txt|md)$/,
        use: "raw-loader"
      }
    ]
  },

  plugins: [
    isDev && new webpack.NamedModulesPlugin(),
    isDev && new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(isDev ? "development" : "production")
      }
    }),

    new HtmlWebpackPlugin({
      inject: true,
      template: resolvePath(PATHS.src, "index.ejs")
    })
  ].filter(truthy),

  optimization: {
    splitChunks: {
      chunks: "all"
    },
    runtimeChunk: true
  }
};

function truthy(x) {
  return !!x;
}
