import { Demo } from "../entries/plan";
export default {
  title: "Library/AI and agents/Plan",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Live", "Failed", "Settled"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Live" } };
export const Mode1 = { args: { initialTab: "Failed" } };
export const Mode2 = { args: { initialTab: "Settled" } };
