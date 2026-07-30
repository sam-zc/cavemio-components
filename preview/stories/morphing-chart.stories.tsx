import { Demo } from "../entries/morphing-chart";
export default {
  title: "Library/Charts/Morphing chart",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Revenue", "Today", "Visitors"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Revenue" } };
export const Mode1 = { args: { initialTab: "Today" } };
export const Mode2 = { args: { initialTab: "Visitors" } };
