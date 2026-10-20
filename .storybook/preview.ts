import type { Preview } from "@storybook/react-vite";
import { createElement, useEffect } from "react";
import {
  themePalettes,
  isThemePalette,
  isThemeMode,
} from "../preview/theme-options";
import "../preview/styles.css";

const preview: Preview = {
  globalTypes: {
    palette: {
      toolbar: {
        title: "Palette",
        icon: "paintbrush",
        items: themePalettes.map(({ id, name }) => ({
          value: id,
          title: name,
        })),
        dynamicTitle: true,
      },
    },
    mode: {
      toolbar: {
        title: "Appearance",
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { palette: "cavemio", mode: "light" },
  decorators: [
    function ThemeDecorator(Story, context) {
      useEffect(() => {
        document.documentElement.dataset.palette = isThemePalette(
          context.globals.palette,
        )
          ? context.globals.palette
          : "cavemio";
        document.documentElement.dataset.theme = isThemeMode(
          context.globals.mode,
        )
          ? context.globals.mode
          : "light";
      }, [context.globals.palette, context.globals.mode]);
      return createElement(Story);
    },
  ],
  parameters: {
    layout: "centered",
    controls: { expanded: true },
  },
  tags: ["autodocs"],
};

export default preview;
