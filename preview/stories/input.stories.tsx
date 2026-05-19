import { Demo } from "../entries/input";
export default {
  title: "Library/Inputs and forms/Input",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Fields", "Error", "Sizes"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Fields" } };
export const Mode1 = { args: { initialTab: "Error" } };
export const Mode2 = { args: { initialTab: "Sizes" } };
