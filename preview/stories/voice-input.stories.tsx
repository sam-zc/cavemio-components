import { Demo } from "../entries/voice-input";
export default {
  title: "Library/AI and agents/Voice input",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Live", "In a composer", "Blocked", "Error"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Live" } };
export const Mode1 = { args: { initialTab: "In a composer" } };
export const Mode2 = { args: { initialTab: "Blocked" } };
export const Mode3 = { args: { initialTab: "Error" } };
