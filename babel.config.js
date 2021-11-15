module.exports = (api) => {
  api.cache(true);

  const presets = ['@babel/preset-env'];
  const plugins = [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-transform-runtime', { helpers: false, regenerator: true }],
    ['@babel/plugin-proposal-class-properties'],
    ['@babel/plugin-proposal-private-methods']
  ];

  // Instrument code for e2e test coverage
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    plugins.push(['istanbul', {
      coverageGlobalScopeFunc: false,
      coverageGlobalScope: 'window'
    }, 'istanbul-cov']);
  }

  return {
    presets,
    plugins
  };
};
