/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const assetFile =
  "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css|sass)$";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  preset: "ts-jest",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  modulePathIgnorePatterns: ["<rootDir>/public/"],
  coveragePathIgnorePatterns: ["/node_modules/", assetFile],
  modulePaths: ["<rootDir>/src"],
  transform: {
    [assetFile]: "<rootDir>/jest/transformAssetFiles.js",
  },
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: -10,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
