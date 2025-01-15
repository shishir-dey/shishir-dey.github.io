const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Entry file
  output: {
    path: path.resolve(__dirname, 'build'), // Output directory
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // For both .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader' // Use Babel loader
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'] // Allow importing without specifying extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // HTML template
      filename: 'index.html'
    }),
    // Add CopyWebpackPlugin to copy markdown files and static files
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './public/content/notes'), // Source directory for markdown
          to: path.resolve(__dirname, 'build/content/notes')  // Destination directory in the build folder
        },
        {
          from: path.resolve(__dirname, './public/robots.txt'),
          to: path.resolve(__dirname, 'build')
        },
        {
          from: path.resolve(__dirname, './public/sitemap.xml'),
          to: path.resolve(__dirname, 'build')
        },
        {
          from: path.resolve(__dirname, './public/logo.png'),
          to: path.resolve(__dirname, 'build')
        }
      ]
    })
  ],
  devServer: {
    static: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000
  },
  mode: 'development' // Development mode for easier debugging
};
