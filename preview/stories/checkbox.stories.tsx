import { Demo } from "../entries/checkbox";
export default {
  title: "Library/Inputs and forms/Checkbox",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Single", "Group"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Single" } };
export const Mode1 = { args: { initialTab: "Group" } };
