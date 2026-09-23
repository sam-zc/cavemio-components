import { Demo } from "../entries/code-block";
export default {
  title: "Library/AI and agents/Code block",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Streaming", "Folded", "Apply"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Streaming" } };
export const Mode1 = { args: { initialTab: "Folded" } };
export const Mode2 = { args: { initialTab: "Apply" } };
