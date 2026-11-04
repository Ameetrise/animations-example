const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    files: ["app/features/three-d-reveal/**/*.tsx"],
    rules: {
      "react/no-unknown-property": "off",
      "@typescript-eslint/no-require-imports": [
        "error",
        {
          allow: ["\\.(glb|webp)$", "^\\./ThreeDRevealDemo$"],
        },
      ],
    },
  },
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
