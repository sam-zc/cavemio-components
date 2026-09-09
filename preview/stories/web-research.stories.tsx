import { Demo } from "../entries/web-research";
export default {
  title: "Library/AI and agents/Web research",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Live", "Done", "Failed"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Live" } };
export const Mode1 = { args: { initialTab: "Done" } };
export const Mode2 = { args: { initialTab: "Failed" } };
