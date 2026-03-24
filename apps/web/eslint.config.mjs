import nextPlugin from "@next/eslint-plugin-next"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"

export default [
  // React + Next.js rules without importing eslint-config-next
  {
  plugins: {
    react: reactPlugin,
    "react-hooks": reactHooksPlugin,
    "@next/next": nextPlugin,
  },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactHooksPlugin.configs.recommended.rules,
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
  },
  // TypeScript
  {
  files: ["**/*.ts", "**/*.tsx"],
  plugins: {
    "@typescript-eslint": tsPlugin,
  },
  languageOptions: {
    parser: tsParser,
  },
  rules: {
    ...tsPlugin.configs.recommended.rules,
  },
  },
  // Custom overrides
  {
  rules: {
    "@next/next/no-duplicate-head": "off",
  },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
]
