module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable ESLint
      webpackConfig.plugins = webpackConfig.plugins.filter(
        plugin => plugin.constructor.name !== 'ESLintWebpackPlugin'
      );
      return webpackConfig;
    },
  },
  style: {
    postcssOptions: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
}
