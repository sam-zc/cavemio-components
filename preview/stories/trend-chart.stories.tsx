import { Demo } from "../entries/trend-chart";
export default {
  title: "Library/Charts/Trend chart",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Visitors", "Compare", "Zoom", "Unfinished day"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Visitors" } };
export const Mode1 = { args: { initialTab: "Compare" } };
export const Mode2 = { args: { initialTab: "Zoom" } };
export const Mode3 = { args: { initialTab: "Unfinished day" } };
