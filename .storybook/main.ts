import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig, type UserConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../preview/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  staticDirs: [
    { from: "../tests/fixtures/video", to: "/video-fixtures" },
    { from: "../public/fonts", to: "/fonts" },
    { from: "../public/lifecycle", to: "/lifecycle" },
    ...(existsSync(new URL("../public/demos", import.meta.url))
      ? [{ from: "../public/demos", to: "/demos" }]
      : []),
  ],
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      // Storybook has its own demo entries; registry artifacts are served separately.
      publicDir: false,
      build: {
        rolldownOptions: {
          onwarn(warning, defaultHandler) {
            // This preview runs entirely in the browser, so RSC directives are inert.
            if (
              warning.code === "MODULE_LEVEL_DIRECTIVE" &&
              warning.message.includes("use client")
            )
              return;
            defaultHandler(warning);
          },
        },
      },
      resolve: {
        alias: {
          "@": fileURLToPath(new URL("../preview", import.meta.url)),
        },
      },
    } satisfies UserConfig);
  },
};

export default config;
