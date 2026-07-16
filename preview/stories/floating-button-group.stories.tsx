import { Demo } from "../entries/floating-button-group";
export default {
  title: "Library/Buttons and actions/Floating button group",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Canvas", "Stepper", "Actions"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Canvas" } };
export const Mode1 = { args: { initialTab: "Stepper" } };
export const Mode2 = { args: { initialTab: "Actions" } };
