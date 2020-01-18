const { resolve: resolvePath, join: joinPath } = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssCustomProperties = require("postcss-custom-properties");

const isProd = process.env["NODE_ENV"] === "production";
const isDev = !isProd;

const ROOT = __dirname;
const PATHS = {
  src: resolvePath(ROOT, "./src"),
  dist: resolvePath(ROOT, "./dist"),
  node_modules: resolvePath(ROOT, "./node_modules")
};
const PUBLIC_URL = isProd ? "/discrelog/" : "/";

module.exports = {
  mode: isDev ? "development" : "production",

  devServer: {
    contentBase: PATHS.dist
  },

  devtool: "source-map",

  entry: {
    client: [joinPath(PATHS.src, "./index.tsx")]
  },

  output: {
    filename: "[name].[hash].bundle.js",
    path: PATHS.dist,
    publicPath: PUBLIC_URL
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

      // Enable TS file support
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      },

      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]"
              }
            }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [postcssCustomProperties()]
            }
          }
        ]
      },

      // Pull in text and markdown files raw.
      {
        test: /\.(txt|md)$/,
        use: "raw-loader"
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: resolvePath(PATHS.src, "index.ejs")
    }),
    new MiniCssExtractPlugin()
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
