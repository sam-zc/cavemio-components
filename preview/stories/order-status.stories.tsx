import { Demo } from "../entries/order-status";
export default {
  title: "Library/Blocks/Order status",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Live", "Delivered", "Cancel"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Live" } };
export const Mode1 = { args: { initialTab: "Delivered" } };
export const Mode2 = { args: { initialTab: "Cancel" } };
