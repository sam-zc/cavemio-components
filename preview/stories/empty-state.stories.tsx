import { Demo } from "../entries/empty-state";
export default {
  title: "Library/Display and navigation/Empty state",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["First run", "No results", "Connect", "All done"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "First run" } };
export const Mode1 = { args: { initialTab: "No results" } };
export const Mode2 = { args: { initialTab: "Connect" } };
export const Mode3 = { args: { initialTab: "All done" } };
