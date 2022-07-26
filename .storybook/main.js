const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ['../**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  typescript: {
    check: false,
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: prop => prop.parent ? !/node_modules/.test(prop.parent.fileName) : true
    }
  },
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app"
  ],
  "core": {
    "builder": "webpack5"
  },
  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require('@babel/preset-typescript').default,
              [require('@babel/preset-react').default, { runtime: 'automatic' }],
              require('@babel/preset-env').default,
            ],
          },
        },
      ],
    })

    config.resolve.extensions.push('.ts', '.tsx')

    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    })

    config.resolve.extensions.push('.mjs')

    return config
  }
};