import { Demo } from "../entries/pricing-plans";
export default {
  title: "Library/Blocks/Pricing plans",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Plans", "Current plan", "Declined"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Plans" } };
export const Mode1 = { args: { initialTab: "Current plan" } };
export const Mode2 = { args: { initialTab: "Declined" } };
