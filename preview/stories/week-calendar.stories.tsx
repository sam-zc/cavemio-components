import { Demo } from "../entries/week-calendar";
export default {
  title: "Library/Inputs and forms/Week calendar",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Plan your week", "Overlaps", "Day view", "Save fails"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Plan your week" } };
export const Mode1 = { args: { initialTab: "Overlaps" } };
export const Mode2 = { args: { initialTab: "Day view" } };
export const Mode3 = { args: { initialTab: "Save fails" } };
