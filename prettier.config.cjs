/** @type {import('prettier').Config} */
module.exports = {
  // @ts-expect-error
  ...require("@itsmapleleaf/configs/prettier"),
  // @ts-expect-error
  plugins: [require("prettier-plugin-tailwindcss")],
}
