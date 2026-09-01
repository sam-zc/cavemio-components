import { Demo } from "../entries/thinking-trace";
export default {
  title: "Library/AI and agents/Thinking trace",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Steps", "Reasoning", "Search", "Tools", "Error"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Steps" } };
export const Mode1 = { args: { initialTab: "Reasoning" } };
export const Mode2 = { args: { initialTab: "Search" } };
export const Mode3 = { args: { initialTab: "Tools" } };
export const Mode4 = { args: { initialTab: "Error" } };
