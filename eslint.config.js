import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [".vinext/**", "node_modules/**", "dist/**", "build/**"],
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
