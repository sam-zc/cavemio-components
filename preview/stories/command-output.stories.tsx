import { Demo } from "../entries/command-output";
export default {
  title: "Library/AI and agents/Command output",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Passing", "Failing"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Passing" } };
export const Mode1 = { args: { initialTab: "Failing" } };
