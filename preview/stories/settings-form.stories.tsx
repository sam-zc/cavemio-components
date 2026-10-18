import { Demo } from "../entries/settings-form";
export default {
  title: "Library/Data and app UI/Settings form",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Settings", "Server says no"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Settings" } };
export const Mode1 = { args: { initialTab: "Server says no" } };
