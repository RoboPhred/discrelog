const postcssCustomProperties = require("postcss-custom-properties");
const autoprefixer = require("autoprefixer");

// Consider using https://github.com/csstools/postcss-preset-env
module.exports = {
  plugins: [
    postcssCustomProperties({ importFrom: "src/styles/variables.css" }),
    autoprefixer,
  ],
};
