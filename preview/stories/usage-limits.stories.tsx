import { Demo } from "../entries/usage-limits";
export default {
  title: "Library/AI and agents/Usage limits",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Normal", "Near the limit", "Reached"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Normal" } };
export const Mode1 = { args: { initialTab: "Near the limit" } };
export const Mode2 = { args: { initialTab: "Reached" } };
