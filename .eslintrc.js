module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
    "plugin:mocha/recommended",
  ],
  plugins: ["mocha"],
  rules: {
    quotes: ["error", "double"],
  },
  parserOptions: {
    "ecmaVersion": 2017,
  },
};
