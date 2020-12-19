const { webpackConfig } = require("direflow-scripts");

/**
 * Webpack configuration for Direflow Component
 * Additional webpack plugins / overrides can be provided here
 */
module.exports = (config, env) => {
  let configOverride = webpackConfig(config, env);
  // Add your own webpack config here (optional)

  configOverride.plugins = [
    ...configOverride.plugins,
    ...[],
  ];

  return configOverride;
};
