import { Demo } from "../entries/json-inspector";
export default {
  title: "Library/Data and app UI/JSON inspector",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Webhook", "Search", "Diff", "Broken"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Webhook" } };
export const Mode1 = { args: { initialTab: "Search" } };
export const Mode2 = { args: { initialTab: "Diff" } };
export const Mode3 = { args: { initialTab: "Broken" } };
