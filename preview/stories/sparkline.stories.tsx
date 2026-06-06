import { Demo } from "../entries/sparkline";
export default {
  title: "Library/Charts/Sparkline",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Table cell", "Stat strip", "Bar variant"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Table cell" } };
export const Mode1 = { args: { initialTab: "Stat strip" } };
export const Mode2 = { args: { initialTab: "Bar variant" } };
