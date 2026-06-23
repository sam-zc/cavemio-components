import { Demo } from "../entries/avatar";
export default {
  title: "Library/Display and navigation/Avatar",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["People", "Group"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "People" } };
export const Mode1 = { args: { initialTab: "Group" } };
