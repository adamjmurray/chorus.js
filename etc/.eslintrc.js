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
    "no-var": ["error"],
    "mocha-no-only/mocha-no-only": ["error"],
    "max-len": ["error", {
      code: 120,
      ignoreComments: true,
    }],
    "no-throw-literal": ["error"],
  }
};
