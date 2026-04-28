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
      // Recovered external demo fixtures; canonical UI and typed boundaries are checked.
      "preview/reference/generated/**",
    ],
  },
  ...tseslint.configs.recommended,
);
