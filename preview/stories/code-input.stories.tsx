import { Demo } from "../entries/code-input";
export default {
  title: "Library/Inputs and forms/Code input",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Try it", "Autofill", "Wrong code"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Try it" } };
export const Mode1 = { args: { initialTab: "Autofill" } };
export const Mode2 = { args: { initialTab: "Wrong code" } };
