import { Demo } from "../entries/filter-bar";
export default {
  title: "Library/Data and app UI/Filter bar",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Issues", "Describe it", "Customers", "Editing"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Issues" } };
export const Mode1 = { args: { initialTab: "Describe it" } };
export const Mode2 = { args: { initialTab: "Customers" } };
export const Mode3 = { args: { initialTab: "Editing" } };
