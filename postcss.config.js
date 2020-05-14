const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// It is handy to not have those transformations while we developing
if (process.env.NODE_ENV === 'production') {
  module.exports = {
    plugins: [
      autoprefixer,
      cssnano
    ]
  };
}
