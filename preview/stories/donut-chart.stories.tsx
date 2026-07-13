import { Demo } from "../entries/donut-chart";
export default {
  title: "Library/Charts/Donut chart",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Breakdown", "Budget"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Breakdown" } };
export const Mode1 = { args: { initialTab: "Budget" } };
