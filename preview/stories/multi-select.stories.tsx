import { Demo } from "../entries/multi-select";
export default {
  title: "Library/Inputs and forms/Multi-select",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Filter", "Long list"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Filter" } };
export const Mode1 = { args: { initialTab: "Long list" } };
