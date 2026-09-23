import { Demo } from "../entries/checkout";
export default {
  title: "Library/Blocks/Checkout",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Checkout", "Prefilled", "Declined"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Checkout" } };
export const Mode1 = { args: { initialTab: "Prefilled" } };
export const Mode2 = { args: { initialTab: "Declined" } };
