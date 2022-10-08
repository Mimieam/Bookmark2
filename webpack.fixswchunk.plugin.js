/**
 * created this file to fix webpack for MV3 service worker whose chunks are not loaded because there isn't an HTML page..
 * so this plugin is used to load the chunks in the service worker - by adding self.importScripts() statement to the service worker.
 * possible improvement:
 * - autodetect the chunks and add them to the service worker.
 * - note this should not be used when chunk=async is used.
 */
class FixSWChunks {
  static defaultOptions = {
    serviceWorker: 'bg-sw.js',
    vendor: 'vendors.js',
    manifest_version: 3,
  };

  // Any options should be passed in the constructor of your plugin,
  // (this is a public API of your plugin).
  constructor(options = {}) {
    // Applying user-specified options over the default options
    // and making merged options further available to the plugin methods.
    // You should probably validate all the options here as well.
    this.options = { ...FixSWChunks.defaultOptions, ...options };
  }

  apply(compiler) {
    const pluginName = FixSWChunks.name;

    // webpack module instance can be accessed from the compiler object,
    // this ensures that correct version of the module is used
    // (do not require/import the webpack or any symbols from it directly).
    const { webpack } = compiler;

    // Compilation object gives us reference to some useful constants.
    const { Compilation, sources } = webpack;

    // RawSource is one of the "sources" classes that should be used
    // to represent asset sources in compilation.
    const { RawSource } = webpack.sources;
    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
      // Explore each chunk (build output):


      callback();
    });

    let vendor_src;
    let sw_compiled_src;

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        (assets) => {
          // get the file main.js
          // const stats = compilation.getStats(this.options.serviceWorker);
          const file = compilation.getAsset(this.options.serviceWorker);
          // const dependency = compilation.getDependencyReference(this.options.serviceWorker);
          // console.log(stats)
          // const _chunks = compilation.getAsset(this.options.vendorName);
          const vendor = compilation.getAsset(this.options.vendor);
          // const vendor = assets[this.options.vendor];
          // console.log(vendor)
          // console.log('List of assets and their sizes:');
          // Object.entries(assets).forEach(([pathname, source]) => {
          //   console.log(`— ${pathname}: ${source.size()} bytes`);
          // });
          // update main.js with new content

          compilation.updateAsset(
            this.options.serviceWorker,
            // new sources.RawSource(`self.importScripts("${this.options.vendor}");\n${file.source.source()}`)
            new sources.RawSource(
              this.options.manifest_version == 3 ?
              `self.importScripts("${this.options.vendor}");\n${file.source.source()}`:
              `${ vendor.source.source() }\n${ file.source.source() }`
            )
          );
        }
      );
    });
  }
}

module.exports = { FixSWChunks };