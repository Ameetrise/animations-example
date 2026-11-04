module.exports = ({ config }) => ({
  ...config,
  name: process.env.EXPO_PUBLIC_BRAND === "spinquest" ? "SpinQuest" : "Pack.com",
});
