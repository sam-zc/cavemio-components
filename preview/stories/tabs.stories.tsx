import { Demo } from "../entries/tabs";
export default {
  title: "Library/Display and navigation/Tabs",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Underline", "Pills"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Underline" } };
export const Mode1 = { args: { initialTab: "Pills" } };
