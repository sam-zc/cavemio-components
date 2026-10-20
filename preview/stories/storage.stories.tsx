import { Demo } from "../entries/storage";
export default {
  title: "Library/Blocks/Storage",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Nearly full", "Plenty of room"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Nearly full" } };
export const Mode1 = { args: { initialTab: "Plenty of room" } };
