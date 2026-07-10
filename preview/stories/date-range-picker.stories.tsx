import { Demo } from "../entries/date-range-picker";
export default {
  title: "Library/Inputs and forms/Date range picker",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Analytics", "Stay"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Analytics" } };
export const Mode1 = { args: { initialTab: "Stay" } };
