import { Demo } from "../entries/toggle-group";
export default {
  title: "Library/Display and navigation/Toggle group",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Formatting", "Filters"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Formatting" } };
export const Mode1 = { args: { initialTab: "Filters" } };
