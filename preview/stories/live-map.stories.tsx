import { Demo } from "../entries/live-map";
export default {
  title: "Library/Data and app UI/Live map",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Signups", "Orders"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Signups" } };
export const Mode1 = { args: { initialTab: "Orders" } };
