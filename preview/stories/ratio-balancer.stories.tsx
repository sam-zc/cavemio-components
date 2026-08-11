import { Demo } from "../entries/ratio-balancer";
export default {
  title: "Library/Motion and landing/Ratio balancer",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["compute", "budget", "traffic"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "compute" } };
export const Mode1 = { args: { initialTab: "budget" } };
export const Mode2 = { args: { initialTab: "traffic" } };
