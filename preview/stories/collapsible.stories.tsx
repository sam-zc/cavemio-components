import { Demo } from "../entries/collapsible";
export default {
  title: "Library/Display and navigation/Collapsible",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["List", "Details"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "List" } };
export const Mode1 = { args: { initialTab: "Details" } };
