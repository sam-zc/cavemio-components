import { Demo } from "../entries/wheel-picker";
export default {
  title: "Library/Inputs and forms/Wheel picker",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Alarm", "Timer", "Date"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Alarm" } };
export const Mode1 = { args: { initialTab: "Timer" } };
export const Mode2 = { args: { initialTab: "Date" } };
