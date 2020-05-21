const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// Only Minify on Prod Setting
if (process.env.NODE_ENV === 'production') {
  module.exports = {
    plugins: [
      autoprefixer,
      cssnano
    ]
  };
} else {
  module.exports = {
    plugins: [
      autoprefixer
    ]
  };
}
