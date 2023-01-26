const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const prodEntry = require('./scripts/webpack-prod-entry');
const prodOutput = require('./scripts/webpack-prod-output');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';
process.env.NODE_ENV = isProduction ? 'production' : 'development';

module.exports = {
  entry: () => prodEntry(),
  output: {
    filename: (pathData) => (pathData.chunk.name === 'enterprise-wc' ? '[name].js' : `${prodOutput(pathData.chunk.name)}/[name].js`),
    path: path.resolve(__dirname, `build/dist/${isProduction ? 'production' : 'development'}`),
    publicPath: '/',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  infrastructureLogging: {
    level: 'error' // or 'verbose' if any debug info is needed
  },
  resolve: {
    extensions: ['.js', '.ts'],
    modules: ['node_modules']
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 3 * 1024 // 3kb
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, 'build')
        ],
        use: [
          'sass-to-string',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'expanded',
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, 'src')
        ],
        use: [
          // Creates `style` nodes from JS strings
          {
            loader: 'style-loader'
          },
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ]
      },
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'ts',
              format: 'esm',
              target: 'es2022'
            },
          }
        ],
        exclude: [/node_modules/],
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]/[name].css'
    }),
    // Copy the standalone css and d.ts files to the output directory
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './build/types/src/**/ids*.d.ts',
          to({ absoluteFilename }) {
            const baseName = path.basename(absoluteFilename);
            const folders = path.dirname(absoluteFilename).split(path.sep);
            let filePath = `${folders[folders.length - 2]}/${folders[folders.length - 1]}/${baseName}`;
            filePath = filePath.replace('src/components', '');

            if (filePath.includes('core/')) {
              filePath = filePath.replace('core/', '').replace('.d.ts', '');
              return `core/${filePath.replace('src/', '')}.d.ts`;
            }
            console.log(absoluteFilename, filePath);
            return filePath;
          }
        },
        {
          from: './build/types/src/enterprise-wc.d.ts',
          to({ absoluteFilename }) {
            return absoluteFilename.replace('/build/types/src/', `/build/dist/${isProduction ? 'production' : 'development'}/`);
          }
        },
        {
          from: './src/components/**/README.md',
          to({ absoluteFilename }) {
            const baseName = path.basename(absoluteFilename);
            const folders = path.dirname(absoluteFilename).split(path.sep);
            let filePath = `${folders[folders.length - 2]}/${folders[folders.length - 1]}/${baseName}`;
            filePath = filePath.replace('src/components', '');
            return filePath;
          }
        }
      ]
    })
  ],
  devtool: isProduction ? false : 'source-map',
  mode: isProduction ? 'production' : 'development',
};
