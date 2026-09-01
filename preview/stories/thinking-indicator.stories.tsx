import { Demo } from "../entries/thinking-indicator";
export default {
  title: "Library/AI and agents/Thinking indicator",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Orbit", "Dots", "Pulse", "Scan", "Done"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Orbit" } };
export const Mode1 = { args: { initialTab: "Dots" } };
export const Mode2 = { args: { initialTab: "Pulse" } };
export const Mode3 = { args: { initialTab: "Scan" } };
export const Mode4 = { args: { initialTab: "Done" } };
