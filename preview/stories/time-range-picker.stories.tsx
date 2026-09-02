import { Demo } from "../entries/time-range-picker";
export default {
  title: "Library/Inputs and forms/Time range picker",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Live", "Drag to zoom", "Type a range"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Live" } };
export const Mode1 = { args: { initialTab: "Drag to zoom" } };
export const Mode2 = { args: { initialTab: "Type a range" } };
