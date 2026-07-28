import { Demo } from "../entries/mention-menu";
export default {
  title: "Library/AI and agents/Mentions and commands",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Try it", "With context"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Try it" } };
export const Mode1 = { args: { initialTab: "With context" } };
