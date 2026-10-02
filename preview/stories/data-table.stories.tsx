import { Demo } from "../entries/data-table";
export default {
  title: "Library/Data and app UI/Data table",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Customers", "Live updates", "Bulk actions", "Phone cards"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Customers" } };
export const Mode1 = { args: { initialTab: "Live updates" } };
export const Mode2 = { args: { initialTab: "Bulk actions" } };
export const Mode3 = { args: { initialTab: "Phone cards" } };
