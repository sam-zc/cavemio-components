import { Demo } from "../entries/prompt-composer";
export default {
  title: "Library/AI and agents/Prompt composer",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Live", "With files", "Rate limited"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Live" } };
export const Mode1 = { args: { initialTab: "With files" } };
export const Mode2 = { args: { initialTab: "Rate limited" } };
