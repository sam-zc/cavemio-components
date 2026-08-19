import { Demo } from "../entries/steps";
export default {
  title: "Library/Display and navigation/Steps",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Horizontal", "Vertical"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Horizontal" } };
export const Mode1 = { args: { initialTab: "Vertical" } };
