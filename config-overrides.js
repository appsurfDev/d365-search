module.exports = function override(config, env) {
  config.output.filename = "js/[name].js"
  config.output.chunkFilename = "js/[name].chunk.js"

  const miniCssExtractPlugin =
     config.plugins.find(element => element.constructor.name === "MiniCssExtractPlugin");
  miniCssExtractPlugin.options.filename = "css/[name].css"
  miniCssExtractPlugin.options.chunkFilename = "css/[name].css"

  config.module.rules[1].oneOf.forEach(oneOf => {
     if (!oneOf.use || !oneOf.use.options || oneOf.options.name !== "media/[name].[hash].[ext]") {
      return;
     }
     oneOf.options.name = "media/[name].[ext]"
  });

  config.optimization.splitChunks = {
     cacheGroups: {
      default: false,
   },
  };

  return config;
};