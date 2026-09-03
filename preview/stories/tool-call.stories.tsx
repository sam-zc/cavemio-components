import { Demo } from "../entries/tool-call";
export default {
  title: "Library/AI and agents/Tool call",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Live", "Error", "Denied", "Custom output"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Live" } };
export const Mode1 = { args: { initialTab: "Error" } };
export const Mode2 = { args: { initialTab: "Denied" } };
export const Mode3 = { args: { initialTab: "Custom output" } };
