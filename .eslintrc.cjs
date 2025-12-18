module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    "@typescript-eslint",
    "react-hooks",
    "react-refresh",
    "unused-imports",
    "prettier",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],

    "react-hooks/exhaustive-deps": "error",

    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
  overrides: [
    {
      files: [
        "*.cjs",
        "*.js",
        "*.mjs",
        "vite.config.*",
        "vitest.config.*",
        "eslint.config.*",
      ],
      env: {
        node: true,
      },
    },
  ],
  ignorePatterns: ["dist", "coverage"],
};
