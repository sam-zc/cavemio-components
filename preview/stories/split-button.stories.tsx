import { Demo } from "../entries/split-button";
export default {
  title: "Library/Buttons and actions/Split button",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Primary", "Secondary", "Destructive"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Primary" } };
export const Mode1 = { args: { initialTab: "Secondary" } };
export const Mode2 = { args: { initialTab: "Destructive" } };
