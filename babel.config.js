module.exports = (api) => {
  api.cache(true);

  const presets = ['@babel/preset-env'];
  const plugins = [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-transform-runtime'],
    ['@babel/plugin-proposal-class-properties'],
    ['@babel/plugin-proposal-private-methods']
  ];

  return {
    presets,
    plugins
  };
};
