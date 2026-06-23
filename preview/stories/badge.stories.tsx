import { Demo } from "../entries/badge";
export default {
  title: "Library/Display and navigation/Badge",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Status", "Counts"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Status" } };
export const Mode1 = { args: { initialTab: "Counts" } };
