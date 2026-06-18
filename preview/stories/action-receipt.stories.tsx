import { Demo } from "../entries/action-receipt";
export default {
  title: "Library/AI and agents/Action receipts",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Live", "Stacked", "Failed"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Live" } };
export const Mode1 = { args: { initialTab: "Stacked" } };
export const Mode2 = { args: { initialTab: "Failed" } };
