import { Demo } from "../entries/subscription";
export default {
  title: "Library/Blocks/Subscription",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Active", "Payment failed", "Paused"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Active" } };
export const Mode1 = { args: { initialTab: "Payment failed" } };
export const Mode2 = { args: { initialTab: "Paused" } };
