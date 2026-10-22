import tseslint from "typescript-eslint";
export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "public/**",
      "storybook-static/**",
      "playwright-report/**",
      "test-results/**",
      "output/playwright/**",
    ],
  },
  ...tseslint.configs.recommended,
);
