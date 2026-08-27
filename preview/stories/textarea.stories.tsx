import { Demo } from "../entries/textarea";
export default {
  title: "Library/Inputs and forms/Textarea",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Grow", "Limit", "Error"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Grow" } };
export const Mode1 = { args: { initialTab: "Limit" } };
export const Mode2 = { args: { initialTab: "Error" } };
