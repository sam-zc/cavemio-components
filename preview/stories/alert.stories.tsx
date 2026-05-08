import { Demo } from "../entries/alert";
export default {
  title: "Library/Display and navigation/Alert",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Tones", "Sync", "Dismiss"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Tones" } };
export const Mode1 = { args: { initialTab: "Sync" } };
export const Mode2 = { args: { initialTab: "Dismiss" } };
