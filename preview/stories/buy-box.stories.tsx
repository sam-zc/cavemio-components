import { Demo } from "../entries/buy-box";
export default {
  title: "Library/Blocks/Buy box",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Buy", "Sold out", "Sale"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Buy" } };
export const Mode1 = { args: { initialTab: "Sold out" } };
export const Mode2 = { args: { initialTab: "Sale" } };
