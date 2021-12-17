const {
  getLoaders,
  loaderByName,
} = require("@craco/craco");
module.exports = {
  overrideWebpackConfig: ({
    webpackConfig,
    cracoConfig,
    pluginOptions,
  }) => {
    const config = { ...webpackConfig };
    const urlLoaderCandidates = getLoaders(
      config,
      loaderByName("url-loader")
    );
    const urlLoader = urlLoaderCandidates.matches.find(
      (m) =>
        m.loader &&
        m.loader.test &&
        (Array.isArray(m.loader.test)
          ? m.loader.test.some(
              (r) => r.toString().indexOf("jpe?g") >= 0
            )
          : m.loader.test.toString().indexOf("jpe?g") >= 0)
    );
    if (!urlLoader) {
      throw Error(
        "could not find correct url-loader. did you change react-scripts version?"
      );
    }
    const loader = urlLoader.loader;
    loader.use = [
      {
        loader: loader.loader,
        options: Object.assign({}, loader.options),
      },
      {
        /**
         * @see https://github.com/tcoopman/image-webpack-loader
         */
        loader: "image-webpack-loader",
        options: pluginOptions,
      },
    ];
    delete loader.loader;
    delete loader.options;
    return config;
  },
};
