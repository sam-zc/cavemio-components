import { Demo } from "../entries/search-input";
export default {
  title: "Library/Inputs and forms/Search input",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Shortcut", "Loading"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Shortcut" } };
export const Mode1 = { args: { initialTab: "Loading" } };
