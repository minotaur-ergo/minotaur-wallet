const webpack = require("webpack");

module.exports = function (config) {
    config.externals = {'react-native-sqlite-storage': 'react-native-sqlite-storage'}
    config.optimization = { minimize: false}
    config.plugins = [
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        }),
        ...config.plugins,
        new webpack.ContextReplacementPlugin(
            /ergo-lib-wasm-browser/,
            (data) => {
                delete data.dependencies[0].critical;
                return data;
            }),
    ]
    // update one of rule:
    config.module.rules = config.module.rules.map(rule => {
        if(rule.hasOwnProperty('oneOf')){
            return {
                oneOf: [
                    ...rule.oneOf.map(item => {
                        if(item.type === 'asset/resource') {
                            item.exclude.push(/\.wasm$/)
                        }
                        return item
                    })
                ]
            }
        }
        return rule
    })
    config.ignoreWarnings = [/Failed to parse source map/]
    config.experiments = {asyncWebAssembly: true, syncWebAssembly: true}
    config.resolve.fallback = {
        "crypto": "crypto-browserify",
        "stream": "stream-browserify",
        "path": "path-browserify",
        "fs": false,
    }
    return config
}