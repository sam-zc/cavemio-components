import { Demo } from "../entries/streaming-answer";
export default {
  title: "Library/AI and agents/Streaming answer",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Streaming", "Stopped", "Error"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Streaming" } };
export const Mode1 = { args: { initialTab: "Stopped" } };
export const Mode2 = { args: { initialTab: "Error" } };
