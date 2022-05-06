const path = require('path');
const fs = require("fs");
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const chromeEntries = {
    injector: 'injector.ts',
    background: 'background.ts',
    content: 'content.ts',
}
module.exports = function (config) {
    config.optimization = {
        ...config.optimization,
        runtimeChunk: false
    }
    config.entry = {main: resolveApp("src/connector/index.tsx")};
    Object.entries(chromeEntries).forEach(([key, value]) => {
        config.entry[key] = {
            import: resolveApp(`src/connector/service/chrome/${value}`),
            filename: 'scripts/[name].js'
        }
    })
    config.resolve.fallback = {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer/")
    }
    return config
}