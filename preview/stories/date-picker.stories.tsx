import { Demo } from "../entries/date-picker";
export default {
  title: "Library/Inputs and forms/Date picker",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Due date", "Limits"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Due date" } };
export const Mode1 = { args: { initialTab: "Limits" } };
