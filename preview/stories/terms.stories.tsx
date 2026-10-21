import { Demo } from "../entries/terms";
export default {
  title: "Library/Blocks/Terms",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Read", "Not saved"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Read" } };
export const Mode1 = { args: { initialTab: "Not saved" } };
