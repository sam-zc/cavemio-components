import { Demo } from "../entries/range-ruler";
export default {
  title: "Library/Motion and landing/Range ruler",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["filter", "latency", "budget"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "filter" } };
export const Mode1 = { args: { initialTab: "latency" } };
export const Mode2 = { args: { initialTab: "budget" } };
