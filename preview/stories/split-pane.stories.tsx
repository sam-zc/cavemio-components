import { Demo } from "../entries/split-pane";
export default {
  title: "Library/Motion and landing/Split pane",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["code-preview", "docs-editor", "logs"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "code-preview" } };
export const Mode1 = { args: { initialTab: "docs-editor" } };
export const Mode2 = { args: { initialTab: "logs" } };
