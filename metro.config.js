const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push("glb");
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "three") {
    return {
      type: "sourceFile",
      filePath: path.join(
        path.dirname(require.resolve("three")),
        "three.module.js",
      ),
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
