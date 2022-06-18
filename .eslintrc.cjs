// @ts-ignore
require("@rushstack/eslint-patch/modern-module-resolution")

/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ["mobx"],
  extends: [
    require.resolve("@itsmapleleaf/configs/eslint"),
    "plugin:mobx/recommended",
  ],
  ignorePatterns: [
    "**/node_modules/**",
    "**/build/**",
    "**/dist/**",
    "**/.cache/**",
    "**/coverage/**",
    "**/public/**",
  ],
  parserOptions: {
    project: require.resolve("./tsconfig.json"),
  },
  overrides: [
    {
      files: ["src/{ui,react,dom}/**/*"],
      rules: {
        "mobx/missing-observer": "off",
      },
    },
  ],
}
