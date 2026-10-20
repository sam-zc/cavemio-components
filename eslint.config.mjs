import tseslint from "typescript-eslint";
export default tseslint.config(
  { ignores: ["dist/**", "public/**", "storybook-static/**"] },
  ...tseslint.configs.recommended,
);
