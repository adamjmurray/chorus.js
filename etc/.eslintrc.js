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
    "no-console": 1,
    "mocha-no-only/mocha-no-only": ["error"],
  }
};
