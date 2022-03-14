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
  const argv = process.argv.findIndex((el) => el.includes('coverage'));
  const webpack = process.argv.findIndex((el) => el.includes('webpack'));
  if (argv !== -1 && webpack === 1) {
    console.info('Adding instrumentation for code coverage...');
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
