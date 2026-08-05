import { Demo } from "../entries/poll";
export default {
  title: "Library/Blocks/Poll",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Vote", "Live", "Closed"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Vote" } };
export const Mode1 = { args: { initialTab: "Live" } };
export const Mode2 = { args: { initialTab: "Closed" } };
