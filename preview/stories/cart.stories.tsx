import { Demo } from "../entries/cart";
export default {
  title: "Library/Blocks/Cart",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Cart", "Low stock", "Code refused"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Cart" } };
export const Mode1 = { args: { initialTab: "Low stock" } };
export const Mode2 = { args: { initialTab: "Code refused" } };
