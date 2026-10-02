import { Demo } from "../entries/domain-connect";
export default {
  title: "Library/Data and app UI/Domain connect",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Connect", "Waiting", "Wrong record", "Live"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Connect" } };
export const Mode1 = { args: { initialTab: "Waiting" } };
export const Mode2 = { args: { initialTab: "Wrong record" } };
export const Mode3 = { args: { initialTab: "Live" } };
