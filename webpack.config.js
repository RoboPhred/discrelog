const {
  resolve: resolvePath,
  join: joinPath,
  relative: relativePath,
  sep,
} = require("path");
const { DefinePlugin } = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env["NODE_ENV"] === "production";
const isDev = !isProd;

const ROOT = __dirname;
const PATHS = {
  src: resolvePath(ROOT, "./src"),
  dist: resolvePath(ROOT, "./dist"),
  node_modules: resolvePath(ROOT, "./node_modules"),
};
const PUBLIC_URL = isProd ? "/discrelog/" : "/";

module.exports = {
  mode: isDev ? "development" : "production",

  devServer: {
    contentBase: PATHS.dist,
  },

  devtool: "source-map",

  entry: {
    client: [joinPath(PATHS.src, "./index.tsx")],
  },

  output: {
    filename: "[name].[fullhash].bundle.js",
    path: PATHS.dist,
    publicPath: PUBLIC_URL,
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      "@": PATHS.src,
      // Force svg-arc-to-cubic-bezier to use the cjs build, due to
      //  breaking change on 3.1.0 when ran against normalize-svg-path.
      // This resolves to the cjs build, which is what we want.
      "svg-arc-to-cubic-bezier": require.resolve("svg-arc-to-cubic-bezier"),
    },
    fallback: {
      // Used by react-markdown
      path: require.resolve("path-browserify"),
      // Used by svg-path-bounds
      assert: require.resolve("assert"),
    },
  },

  module: {
    rules: [
      // Process source maps in input sources
      //  All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        loader: "source-map-loader",
      },

      // Enable TS file support
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },

      // Shim process for vfile, used by react-markdown
      {
        test: /node_modules\/vfile\/core\.js/,
        use: [{
          loader: 'imports-loader',
          options: {
            type: 'commonjs',
            imports: ['single process/browser process'],
          },
        }],
      },

      // css files with the modular option.
      {
        test: /\.module\.css$/,
        exclude: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[fullhash:base64:5]",
              },
            },
          },
          {
            loader: "postcss-loader",
          },
        ],
      },

      // Any css that is not .module.css
      {
        test: /^(?!.*[.]module\.css$).*(\.css)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
        ],
      },

      // Fonts
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },

      // Pull in text and markdown files raw.
      {
        test: /\.(txt|md)$/,
        use: "raw-loader",
      },
    ],
  },

  plugins: [
    new DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(isDev ? "development" : "production"),
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: resolvePath(PATHS.src, "index.ejs"),
    }),
    new MiniCssExtractPlugin(),
  ],

  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        npm: {
          test: /node_modules/,
          name: (mod) => {
            const relToModule = relativePath(PATHS.node_modules, mod.context);
            const moduleName = relToModule.substring(
              0,
              relToModule.indexOf(sep)
            );
            return `npm.${moduleName}`;
          },
        },
      },
    },
  },
};
