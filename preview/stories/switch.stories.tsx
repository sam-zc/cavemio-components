import { Demo } from "../entries/switch";
export default {
  title: "Library/Inputs and forms/Switch",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Settings", "Async", "Sizes"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Settings" } };
export const Mode1 = { args: { initialTab: "Async" } };
export const Mode2 = { args: { initialTab: "Sizes" } };
