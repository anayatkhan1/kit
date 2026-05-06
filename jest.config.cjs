/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/ai/agents/web/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.jest.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
