module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  extends: "eslint:recommended",
  plugins: [
    "mocha-no-only"
  ],
  rules: {
    "no-console": ["off"],
    "no-var": ["error"],
    "mocha-no-only/mocha-no-only": ["error"],
  }
};
