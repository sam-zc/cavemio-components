import { Demo } from "../entries/progress";
export default {
  title: "Library/Display and navigation/Progress",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Upload", "Ring", "Unknown"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Upload" } };
export const Mode1 = { args: { initialTab: "Ring" } };
export const Mode2 = { args: { initialTab: "Unknown" } };
