const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/**"],
  },
  {
    files: ["app/components/FpsCounter.tsx", "app/screens/ShowcaseScreen.tsx"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
]);
