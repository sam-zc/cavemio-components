import { Demo } from "../entries/csv-import";
export default {
  title: "Library/Data and app UI/CSV import",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Import", "Server refuses some"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Import" } };
export const Mode1 = { args: { initialTab: "Server refuses some" } };
