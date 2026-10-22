import { Demo } from "../entries/wallet";
export default {
  title: "Library/Blocks/Wallet",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Wallet", "Money in", "Declined"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Wallet" } };
export const Mode1 = { args: { initialTab: "Money in" } };
export const Mode2 = { args: { initialTab: "Declined" } };
