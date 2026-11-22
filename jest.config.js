module.exports = {
  testEnvironment: "jsdom",
  // ponytail: userEvent typing is slow under parallel workers; 5s default flakes
  testTimeout: 20000,
  roots: ["<rootDir>/src"],
  // Babel presets live here, not in a babel.config.js: Gatsby would pick that
  // up and replace babel-preset-gatsby, breaking `gatsby build`.
  transform: {
    "\\.[jt]sx?$": [
      "babel-jest",
      {
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          ["@babel/preset-react", { runtime: "automatic" }],
        ],
      },
    ],
  },
  moduleNameMapper: {
    "^gatsby$": "<rootDir>/jest/gatsby.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest/setup.js"],
}
