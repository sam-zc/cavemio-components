import { Demo } from "../entries/usage-meter";
export default {
  title: "Library/AI and agents/Usage meter",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Normal", "Low", "Out", "Ring"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Normal" } };
export const Mode1 = { args: { initialTab: "Low" } };
export const Mode2 = { args: { initialTab: "Out" } };
export const Mode3 = { args: { initialTab: "Ring" } };
