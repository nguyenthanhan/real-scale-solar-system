import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      ".next/**",
      ".vinext/**",
      "node_modules/**",
      "dist/**",
      "build/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react-hooks/purity": ["off", { allow: ["Math.random"] }],
      // Flags common, valid patterns (e.g. kicking off a data fetch and
      // setting loading state in an effect, syncing local state from a
      // prop). New in eslint-plugin-react-hooks 7.1; revisit case-by-case
      // later instead of blocking CI for existing code.
      "react-hooks/set-state-in-effect": "off",
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
];
